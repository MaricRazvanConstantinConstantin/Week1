
// src/models/ViewStateModel.js
export default class ViewStateModel {
  constructor(bus) {
    this.bus = bus;
    this.state = { loading: false, message: '' };

    bus.on('state:loading', (val) => this._set({ loading: !!val }));
    bus.on('state:message', (msg) => this._set({ message: msg || '' }));
  }

  _set(patch) {
    this.state = { ...this.state, ...patch };
    this.bus.emit('state:changed', { ...this.state });
  }

  get() { return this.state; }
}
