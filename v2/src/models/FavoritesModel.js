
const KEY = 'favoriteCountries';

export default class FavoritesModel {
  constructor(bus) {
    this.bus = bus;
  }

  _load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }

  _save(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
    this.bus.emit('favorites:changed', arr);
  }

  all() { return this._load(); }

  add(name) {
    const list = this._load();
    if (!list.includes(name)) this._save([...list, name]);
  }

  remove(name) {
    const list = this._load().filter(n => n.toLowerCase() !== name.toLowerCase());
    this._save(list);
  }

  toggle(name, isFavorite) {
    if (isFavorite) this.add(name); else this.remove(name);
  }
}