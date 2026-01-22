import TemplateLoader from '../utils/TemplateLoader.js';

export default class HistoryView {
  constructor(bus, container) {
    this.bus = bus;
    this.container = container;
    this.tpl = new TemplateLoader();
    this.wrapperTemplate = null;
    this.itemTemplate = null;
    this.buttonTemplate = null;

    container.addEventListener('click', (e) => {
      const item = e.target.closest('.history-item');
      if (!item) return;
      const name = item.dataset.country;
      this.bus.emit('search:requested', { query: name, source: 'history' });
    });

    container.addEventListener('click', (e) => {
      console.log('Clearing history:...');
      const clearBtn = e.target.closest('.history-clear-button');
      if (!clearBtn) return;
      this.bus.emit('history:clearRequested');
    });
  }

  async _ensureTemplates() {
    if (!this.wrapperTemplate) {
      this.wrapperTemplate = await this.tpl.load('components/history-list.html');
    }
    if (!this.itemTemplate) {
      this.itemTemplate = await this.tpl.load('components/history-item.html');
    }
    if (!this.buttonTemplate) {
      this.buttonTemplate = await this.tpl.load('components/history-clear-button.html');
    }
  }

  async render(list) {
    await this._ensureTemplates();

    if (!list?.length) {
      this.container.innerHTML = '';
      return;
    }

    const itemsHTML = list.map(name => this.tpl.interpolate(this.itemTemplate, { name })).join('');
    const html = this.tpl.injectHTML(this.wrapperTemplate, { items: itemsHTML }) + this.buttonTemplate;
    this.container.innerHTML = html;
  }
}
