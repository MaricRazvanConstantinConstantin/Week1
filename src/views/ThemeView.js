
import TemplateLoader from '../utils/TemplateLoader.js';
import { initTheme, toggleTheme } from '../utils/theme.js';

export default class ThemeView {

  constructor(mountEl) {
    this.mountEl = mountEl;
    this.tpl = new TemplateLoader();
    this.template = null;
  }

  async render() {

    initTheme();

    if (!this.template) {
      this.template = await this.tpl.load('theme-toggle.html');
    }
    this.mountEl.innerHTML = this.template;

    const btn = this.mountEl.querySelector('.theme-toggle');
    const icon = this.mountEl.querySelector('.theme-icon');
    const label = this.mountEl.querySelector('.theme-label');

    const sync = () => {
      const isDark = document.documentElement.classList.contains('dark');
      btn.setAttribute('aria-pressed', String(isDark));
      icon.textContent = isDark ? '🌙' : '☀️';
      label.textContent = isDark ? 'Dark' : 'Light';
    };

    sync();

    btn.addEventListener('click', () => {
      const isDark = toggleTheme();
      document.documentElement.classList.add('transition-colors');
      setTimeout(() => document.documentElement.classList.remove('transition-colors'), 180);
      sync();
    });

    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (mq?.addEventListener) {
      mq.addEventListener('change', () => {
        if (localStorage.getItem('theme') == null) {
          initTheme();
          sync();
        }
      });
    }
  }
}
