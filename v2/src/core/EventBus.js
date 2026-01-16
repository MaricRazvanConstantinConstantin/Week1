
export default class EventBus {
  constructor() { this._events = new Map(); }

  on(event, handler) {
    if (!this._events.has(event)) this._events.set(event, new Set());
    this._events.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    const set = this._events.get(event);
    if (set) set.delete(handler);
  }

  emit(event, payload) {
    const set = this._events.get(event);
    if (set) set.forEach(h => h(payload));
  }
}
