
// src/utils/TemplateLoader.js
export default class TemplateLoader {
  constructor(basePath = './templates') {
    this.basePath = basePath;
    this.cache = new Map();
  }

  async load(name) {
    if (typeof name !== 'string' || !name.trim() || name.trim() === '{}' ) {
      console.error('TemplateLoader.load() received invalid name:', name);
      throw new Error(`Invalid template name: ${String(name)}`);
    }

    const path = `${this.basePath.replace(/\/+$/, '')}/${name.replace(/^\/+/, '')}`;
    if (this.cache.has(path)) return this.cache.get(path);

    console.debug('[TemplateLoader] loading:', path);
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to load template: ${path} (${res.status})`);
    const text = await res.text();
    this.cache.set(path, text);
    return text;
  }

  interpolate(tpl, data = {}) {
    const escapeHtml = (str) =>
      String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    return tpl.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
      const value = key.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), data);
      return value == null ? '' : escapeHtml(value);
    });
  }

  injectHTML(tpl, slots = {}) {
    return tpl.replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (_, key) => {
      const value = key.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), slots);
      return value == null ? '' : String(value);
    });
  }
}
