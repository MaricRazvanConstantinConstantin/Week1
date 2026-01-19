const KEY = 'countrySearchHistory';
const MAX = 10;

export default class HistoryModel {
  constructor(bus) { this.bus = bus; }

  _load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }
  _save(history) {
    localStorage.setItem(KEY, JSON.stringify(history));
    this.bus.emit('history:changed', history);
  }

  all() { return this._load(); }

  add(name) {
    if (!name?.trim()) return this.all();
    let history = this._load().filter(n => n.toLowerCase() !== name.toLowerCase());
    history.unshift(name);
    if (history.length > MAX) history = history.slice(0, MAX);
    this._save(history);
    return history;
  }

  clear() { this._save([]); }
}
