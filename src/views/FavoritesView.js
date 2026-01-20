
import TemplateLoader from '../utils/TemplateLoader.js';

export default class FavoritesView {
  constructor(bus, container) {
    this.bus = bus;
    this.container = container;
    this.tpl = new TemplateLoader();
    this.wrapperTemplate = null;
    this.itemTemplate = null;

    container.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.fav-remove-btn');
      if (!removeBtn) return;
      const wrap = removeBtn.closest('.favorite-item');
      const name = wrap?.dataset.country;
      if (name) this.bus.emit('favorites:toggleRequested', { countryName: name, isFavorite: false });
    });

    container.addEventListener('click', (e) => {
      const item = e.target.closest('.favorite-item');
      if (!item) return;
      const name = item.dataset.country;
      this.bus.emit('search:requested', { query: name, source: 'favorites' });
    });
  }

  async _ensureTemplates() {
    if (!this.wrapperTemplate) {
      this.wrapperTemplate = await this.tpl.load('favorites-list.html');
    }
    if (!this.itemTemplate) {
      this.itemTemplate = await this.tpl.load('favorites-item.html');
    }
  }

  async render(list) {
    await this._ensureTemplates();

    if (!list?.length) {
      this.container.innerHTML = '';
      return;
    }

    const itemsHTML = list.map(name => this.tpl.interpolate(this.itemTemplate, { name })).join('');

    const html = this.tpl.injectHTML(this.wrapperTemplate, { items: itemsHTML });
    this.container.innerHTML = html;
  }
}
