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
}
