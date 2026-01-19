
import DataFormatter from '../utils/DataFormatter.js';
import TemplateLoader from '../utils/TemplateLoader.js';

export default class CountryView {
  constructor(bus, container) {
    this.bus = bus;
    this.container = container;
    this.tpl = new TemplateLoader();
    this.cardTemplate = null;

    this._bindEvents();
  }

  _bindEvents() {
    this.container.addEventListener('click', (e) => {
      const btn = e.target.closest('.favorite-btn');
      if (!btn) return;
      const name = btn.dataset.country;
      const willBeFavorite = !btn.classList.contains('is-active');
      this.bus.emit('favorites:toggleRequested', {
        countryName: name,
        isFavorite: willBeFavorite
      });
    });
  }

  clear() {
    this.container.innerHTML = '';
  }

  async _ensureTemplates() {
    if (!this.cardTemplate) {

      this.cardTemplate = await this.tpl.load('country-card.html');
    }
  }

  async render(country, favoritesList = []) {
    await this._ensureTemplates();
    this.clear();

    if (!country) return;

    const data = DataFormatter.formatCountry(country);

    const isFav = favoritesList.includes(data.name);
    const favoriteClass = isFav ? 'is-active' : '';

    const flagHtml = data.flag
      ? `<img src="${data.flag}" alt="Flag of ${data.name}">`
      : '';

    let html = this.tpl.interpolate(this.cardTemplate, {
      name: data.name,
      capital: data.capital,
      flag: data.flag,
      languages: data.languages,
      mapsUrl: data.mapsUrl,
      population: data.population,
      currency: data.currency,
      favoriteClass
    });

    this.container.innerHTML = html;
  }

  setFavoriteState(countryName, isFavorite) {
    const btn = this.container.querySelector('.favorite-btn');
    if (!btn) return;
    if ((btn.dataset.country || '').toLowerCase() !== countryName.toLowerCase()) return;

    btn.classList.toggle('is-active', isFavorite);
    btn.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
    btn.setAttribute('aria-label', 'Toggle favorite');
  }
}
