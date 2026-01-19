import CountryService from './countryService.js';
import DataFormatter from './dataFormatter.js';
import UIRenderer from './uiRenderer.js';
import StateManager from './stateManager.js';
import HistoryManager from './historyManager.js';
import FavoritesManager from './favoritesManager.js';

class App {
  constructor() {
    this.countryService = new CountryService();
    this.stateManager = new StateManager();
    this.favoritesManager = new FavoritesManager();
    this.uiRenderer = new UIRenderer(this.favoritesManager);
    this.uiElements = this.uiRenderer.buildUI();
    this.historyManager = new HistoryManager();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupStateObserver();

    const history = this.historyManager.getHistory();
    this.uiRenderer.renderHistory(history);
    const favorites = this.favoritesManager.getFavorites();
    this.uiRenderer.renderFavorites(favorites);
  }

  setupEventListeners() {
    this.uiElements.searchButton.addEventListener('click', () => this.handleSearch());

    this.uiElements.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleSearch();
    });

    document.addEventListener('historyItemClicked', (e) => {
      const countryName = e.detail.countryName;
      this.uiElements.input.value = countryName;
      this.performSearch(countryName);
    });

    document.addEventListener('favoriteToggled', (e) => {
      const countryName = e.detail.countryName;
      const isFavorite = e.detail.isFavorite;

      if (isFavorite) {
        this.favoritesManager.addCountry(countryName);
      } else {
        this.favoritesManager.removeCountry(countryName);
      }

      const updatedFavorites = this.favoritesManager.getFavorites();
      this.uiRenderer.renderFavorites(updatedFavorites);

      const state = this.stateManager.getState();
        if (state.results && state.results.name &&
            state.results.name.toLowerCase() === countryName.toLowerCase()) {
              const favBtn = document.querySelector('#card-container .favorite-btn');
              if (favBtn) {
                favBtn.classList.toggle('is-active', isFavorite);
                favBtn.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
                favBtn.setAttribute('aria-label', 'Toggle favorite');
              }
            }
    });
  }

  setupStateObserver() {
    this.stateManager.subscribe((state) => {
      this.updateUI(state);
    });
  }

  async handleSearch() {
    const countryName = this.uiElements.input.value.trim();

    if (!countryName) {
      this.stateManager.setMessage('Please enter a country name');
      this.uiRenderer.clear();
      return;
    }

    await this.performSearch(countryName);
  }

  async performSearch(countryName) {
    this.stateManager.setLoading(true);
    this.stateManager.setMessage('Searching...');

    try {
      const data = await this.countryService.searchByName(countryName);

      if (data && data.length > 0) {
        const formattedData = DataFormatter.formatCountry(data[0]);

        const history = this.historyManager.addCountry(formattedData.name);
        this.uiRenderer.renderHistory(history);

        this.stateManager.setResults(formattedData);
        this.stateManager.setMessage('');
      } else {
        this.stateManager.setMessage('No results');
        this.uiRenderer.clear();
      }
    } catch (error) {
      console.error('Search error:', error);
      this.stateManager.setMessage(`Error: ${error.message}`);
      this.stateManager.setLoading(false);
      this.uiRenderer.clear();
    }
  }

  updateUI(state) {
    if (state.loading) {
      this.uiElements.status.innerHTML = '<div class="spinner"></div>';
    } else if (state.message) {
      this.uiElements.status.textContent = state.message;
    } else {
      this.uiElements.status.textContent = '';
    }

    if (state.results) {
      this.uiRenderer.renderCard(state.results);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new App();
  });
} else {
  new App();
}
