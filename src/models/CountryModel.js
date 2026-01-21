export default class CountryModel {
  constructor(service, bus) {
    this.service = service;
    this.bus = bus;
    this.current = null;
  }

  async search(name) {
    this.bus.emit('state:loading', true);
    try {
      const result = await this.service.searchByName(name);
      const country = result?.[0] ?? null;
      this.current = country;
      this.bus.emit('country:changed', country);
      this.fetchNeighborsForCurrent();
      this.bus.emit('state:message', '');
    } catch (err) {
      this.current = null;
      this.bus.emit('country:changed', null);
      this.bus.emit('state:message', `Error: ${err.message}`);
    } finally {
      this.bus.emit('state:loading', false);
    }
  }

  getCurrent() {
    return this.current;
  }
  
  async fetchNeighborsForCurrent() {
    const country = this.current;
    const borders = country?.borders;

    if (!Array.isArray(borders) || borders.length === 0) {
      this.bus.emit('neighbors:changed', []);
      return;
    }

    try {
      const neighbors = await this.service.getByCodes(borders);
      this.bus.emit('neighbors:changed', neighbors || []);
    } catch (err) {
      console.error('Neighbor fetch failed:', err);
      this.bus.emit('neighbors:changed', []);
    }
  }

}