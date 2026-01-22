import TemplateLoader from "../utils/TemplateLoader.js";
import DataFormatter from "../utils/DataFormatter.js";

export default class NeighborsView {
    
  constructor(bus, containerEl, toggleButtonEl = document.getElementById("neighbors-toggle")) {
    this.bus = bus;
    this.containerEl = containerEl;
    this.toggleButtonEl = toggleButtonEl;

    this.templateLoader = new TemplateLoader();
    this.wrapperTemplate = null; 
    this.cardTemplate = null;   

    this.chevronEl = this.toggleButtonEl?.querySelector(".chevron") || null;
    this.isOpen = false; 

    if (!this.containerEl) {
      console.error("NeighborsView: container element is missing (#neighbors-container).");
      return;
    }
    if (!this.toggleButtonEl) {
      console.error("NeighborsView: toggle button element is missing (#neighbors-toggle).");
      return;
    }

    this._initCollapsible();

    this._bindEvents();

    this.bus.on("neighbors:changed", (neighbors) => {
      const list = Array.isArray(neighbors) ? neighbors : [];
      this.render(list).then(() => {
        if (this.isOpen && list.length) {
          this._expandToContentHeight();
        }
      });
    });
  }

  _initCollapsible() {

    this.containerEl.classList.add(
      "overflow-hidden",
      "transition-[max-height]",
      "duration-300",
      "ease-out"
    );

    this.containerEl.style.maxHeight = "0px";
    this.toggleButtonEl.setAttribute("aria-expanded", "false");
    if (this.chevronEl) this.chevronEl.style.transform = "rotate(0deg)";
  }

  _bindEvents() {

    this.toggleButtonEl.addEventListener("click", () => {
      this.isOpen ? this.close() : this.open();
    });

    this.containerEl.addEventListener("click", (e) => {
      const card = e.target.closest("[data-country]");
      if (!card) return;
      const countryName = card.getAttribute("data-country");
      if (!countryName) return;
      this.bus.emit("search:requested", { query: countryName, source: "neighbors" });
    });
  }

  async _ensureTemplates() {
    if (!this.wrapperTemplate) {
      this.wrapperTemplate = await this.templateLoader.load("components/neighbors-list.html");
    }
    if (!this.cardTemplate) {
      this.cardTemplate = await this.templateLoader.load("components/country-card-compact.html");
    }
  }

  clear() {
    this.containerEl.innerHTML = "";
  }

  async render(neighbors = []) {
    await this._ensureTemplates();
    this.clear();

    if (!neighbors.length) {
      return;
    }

    const itemsHtml = neighbors
      .map((neighbor) => {

        const data = DataFormatter.formatCountryCompact
          ? DataFormatter.formatCountryCompact(neighbor)
          : { name: neighbor.name, flag: neighbor.flag || "" };

        return this.templateLoader.interpolate(this.cardTemplate, data);
      })
      .join("");

    const listHtml = this.templateLoader.injectHTML(this.wrapperTemplate, { items: itemsHtml });
    this.containerEl.innerHTML = listHtml;

    if (this.isOpen) this._expandToContentHeight();
  }

  open() {
    this.isOpen = true;
    this.toggleButtonEl.setAttribute("aria-expanded", "true");
    if (this.chevronEl) {
      this.chevronEl.style.transition = "transform 200ms ease";
      this.chevronEl.style.transform = "rotate(180deg)";
    }
    this._expandToContentHeight();
  }

  close() {
    this.isOpen = false;
    this.toggleButtonEl.setAttribute("aria-expanded", "false");
    if (this.chevronEl) {
      this.chevronEl.style.transition = "transform 200ms ease";
      this.chevronEl.style.transform = "rotate(0deg)";
    }
    this.containerEl.style.maxHeight = "0px";
  }

  _expandToContentHeight() {
    requestAnimationFrame(() => {
      const contentHeight = this.containerEl.scrollHeight;
      this.containerEl.style.maxHeight = `${contentHeight}px`;
    });
  }
}
