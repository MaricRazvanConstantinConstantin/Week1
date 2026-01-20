import TemplateLoader from "../utils/TemplateLoader.js";
import DataFormatter from "../utils/DataFormatter.js";

export default class NeighborsView {
    constructor(bus, container) {
        this.bus = bus;
        this.container = container;
        this.tpl = new TemplateLoader();
        this.wrapperTpl = null;
        this.cardTpl = null;

        this.bus.on('neighbors:changed', (neighbors) => {
            this.render(neighbors);
        });
    }

    async _ensureTemplates() {
        if (!this.wrapperTpl) {
            this.wrapperTpl = await this.tpl.load('components/neighbors-list.html');
        }
        if (!this.cardTpl) {
            this.cardTpl = await this.tpl.load('components/country-card-compact.html');
        }
    }

    clear() {
        this.container.innerHTML = '';
    }

    async render(neighbors = []) {
        await this._ensureTemplates();
        this.clear();

        if (!neighbors?.length) {
            this.clear();
            return;
        };

        const itemsHtml = neighbors.map((n) => {
            const data = DataFormatter.formatCountryCompact(n);
            return this.tpl.interpolate(this.cardTpl, data);
        }).join('');

        const listHtml = this.tpl.injectHTML(this.wrapperTpl, { items: itemsHtml });

        this.container.innerHTML = listHtml;
    }
}