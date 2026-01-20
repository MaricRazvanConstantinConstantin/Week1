import TemplateLoader from "../utils/TemplateLoader.js";
import { initTheme } from "../utils/theme.js";

export default class RootView {
  constructor() {
    this.tpl = new TemplateLoader("./templates/layout");
  }

  async build() {
    initTheme();

    document.body.innerHTML = "";
    document.body.className = `
      bg-slate-100 dark:bg-slate-900
      text-slate-800 dark:text-slate-200
      min-h-screen antialiased
    `;

    const headerHTML = await this.tpl.load("header.html");
    const layoutHTML = await this.tpl.load("layout-grid.html");
    const leftHTML = await this.tpl.load("sidebar-left.html");
    const rightHTML = await this.tpl.load("sidebar-right.html");
    const searchHTML = await this.tpl.load("search-section.html");

    document.body.insertAdjacentHTML("beforeend", headerHTML);
    document.body.insertAdjacentHTML("beforeend", layoutHTML);

    const left = document.querySelector("#sidebar-left");
    const main = document.querySelector("#main");
    const right = document.querySelector("#sidebar-right");

    left.innerHTML = leftHTML;
    right.innerHTML = rightHTML;
    main.innerHTML = searchHTML;

    return {
      input: document.getElementById("search-input"),
      searchButton: document.getElementById("search-button"),
      status: document.getElementById("status"),
      historyContainer: document.getElementById("history-container"),
      cardContainer: document.getElementById("card-container"),
      favoritesContainer: document.getElementById("favorites-container"),
      neighborsContainer: document.getElementById("neighbors-container"),
      themeMount: document.getElementById("theme-toggle-mount"),
    };
  }
}