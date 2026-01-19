
export default class SearchView {
  constructor(bus, inputEl, btnEl) {
    this.bus = bus;
    this.input = inputEl;
    this.button = btnEl;

    this.button.addEventListener('click', () => this._submit());
    this.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') this._submit(); });
  }

  _submit() {
    const q = this.input.value.trim();
    this.bus.emit('search:requested', { query: q, source: 'search' });
  }

  setValue(val) { this.input.value = val ?? ''; }
}
