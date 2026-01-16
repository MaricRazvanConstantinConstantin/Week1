import CountryService from './countryService.js';
import DataFormatter from './dataFormatter.js';
import UIRenderer from './uiRenderer.js';
import StateManager from './stateManager.js';
import HistoryManager from './historyManager.js';

class App {
  constructor() {
    this.countryService = new CountryService();
    this.stateManager = new StateManager();
    this.uiRenderer = new UIRenderer();
    this.uiElements = this.uiRenderer.buildUI();
    this.historyManager = new HistoryManager();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupStateObserver();

    const history = this.historyManager.getHistory();
    this.uiRenderer.renderHistory(history);
  }

  setupEventListeners() {
    this.uiElements.button.addEventListener('click', () => this.handleSearch());
    this.uiElements.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleSearch();
    });

    document.addEventListener('historyItemClicked', (e) => {
      const countryName = e.detail.countryName;
      this.uiElements.input.value = countryName;
      this.performSearch(countryName);
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
