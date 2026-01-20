
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

      const star = btn.querySelector('.star');
      const name = btn.dataset.country;

      const isCurrentlyFav = star?.classList.contains('text-amber-500');
      const willBeFavorite = !isCurrentlyFav;

      this.bus.emit('favorites:toggleRequested', {
        countryName: name,
        isFavorite: willBeFavorite
      });

      if (star) {
        star.classList.toggle('text-amber-500', willBeFavorite);
        star.classList.toggle('text-slate-500', !willBeFavorite);
        btn.classList.toggle('bg-amber-50', willBeFavorite);
        btn.classList.toggle('dark:bg-amber-500/10', willBeFavorite);
      }
    });
  }

  clear() {
    this.container.innerHTML = '';
  }

  async _ensureTemplates() {
    if (!this.cardTemplate) {

      this.cardTemplate = await this.tpl.load('components/country-card.html');
    }
  }

  async render(country, favoritesList = []) {
    await this._ensureTemplates();
    this.clear();

    if (!country) return;

    
    const data = DataFormatter.formatCountry(country);

    let html = this.tpl.interpolate(this.cardTemplate, {
      name: data.name,
      capital: data.capital,
      languages: data.languages,
      mapsUrl: data.mapsUrl,
      population: data.population,
      currency: data.currency,
      flag: data.flag || '' ,
    });

    this.container.innerHTML = html;

    const favBtn = this.container.querySelector('.favorite-btn');
    const star = favBtn?.querySelector('.star');
    if (favBtn && star) {
      const isFav = favoritesList.includes(data.name);

      star.classList.toggle('text-amber-500', isFav);
      star.classList.toggle('text-slate-500', !isFav);

      favBtn.classList.toggle('bg-amber-50', isFav);
      favBtn.classList.toggle('dark:bg-amber-500/10', isFav);
      favBtn.title = isFav ? 'Remove from favorites' : 'Add to favorites';
    }

  }

  
  setFavoriteState(countryName, isFavorite) {
    const btn = this.container.querySelector('.favorite-btn');
    if (!btn) return;

    const cardCountry = (btn.dataset.country || '').toLowerCase();
    if (cardCountry !== (countryName || '').toLowerCase()) return;

    const star = btn.querySelector('.star');
    if (!star) return;

    star.classList.toggle('text-amber-500', isFavorite);
    star.classList.toggle('text-slate-500', !isFavorite);

    btn.classList.toggle('bg-amber-50', isFavorite);
    btn.classList.toggle('dark:bg-amber-500/10', isFavorite);

    btn.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
    btn.setAttribute('aria-label', isFavorite ? 'Remove from favorites' : 'Add to favorites');

    btn.classList.add('scale-105');
    setTimeout(() => btn.classList.remove('scale-105'), 120);
  }

}
