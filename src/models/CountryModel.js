export default class CountryModel {
  constructor(service, bus) {
    this.service = service;
    this.bus = bus;
    this.current = null;
    this._allCache = null;
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


async fetchAllSorted({ sortBy = 'name', order = 'asc' } = {}) {
    this.bus.emit('state:loading', true);

    try {
      if (!this._allCache) {
        const raw = await this.service.getAll();
        this._allCache = (raw || []).map(c => ({
          name: c?.name?.common ?? '',
          flag: c?.flags?.svg || c?.flags?.png || '',
          cca2: c?.cca2 ?? '',
          cca3: c?.cca3 ?? '',
          region: c?.region ?? '',
          population: typeof c?.population === 'number' ? c.population : 0
        }));
      }

      const list = [...this._allCache];

      const norm = (s) =>
        (s || '')
          .toString()
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .toLowerCase()
          .trim();

      list.sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'name') {
          cmp = norm(a.name).localeCompare(norm(b.name));
        } else if (sortBy === 'region') {
          cmp = norm(a.region).localeCompare(norm(b.region)) || norm(a.name).localeCompare(norm(b.name));
        } else if (sortBy === 'population') {
          cmp = a.population - b.population;
        } else {
          cmp = norm(a.name).localeCompare(norm(b.name));
        }
        return order === 'desc' ? -cmp : cmp;
      });

      this.bus.emit('countries:allChanged', {
        list,
        meta: { total: list.length, sortBy, order }
      });
      this.bus.emit('state:message', '');
    } catch (err) {
      this.bus.emit('countries:allChanged', { list: [], meta: { total: 0, sortBy, order } });
      this.bus.emit('state:message', `Error: ${err.message}`);
    } finally {
      this.bus.emit('state:loading', false);
      this.bus.emit('neighbors:changed', []);
    }
  }


}