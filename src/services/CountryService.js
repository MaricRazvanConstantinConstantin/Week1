
export default class CountryService {
  constructor(baseUrl = 'https://restcountries.com/v3.1') {
    this.baseUrl = baseUrl;
  }

  _normalize(str) {
    if (!str) return '';
    return str
      .toString()
      .normalize('NFD')              
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim();
  }

  async searchByName(name, { emptyWhenNoMatch = false } = {}) {
    const query = (name ?? '').trim();
    if (!query) {
      if (emptyWhenNoMatch) return [];
      throw new Error('Please provide a country name');
    }

    const url = `${this.baseUrl}/name/${encodeURIComponent(query)}`;
    const res = await fetch(url);

    if (!res.ok) {
      if (emptyWhenNoMatch) return [];
      throw new Error('Country not found');
    }

    const all = await res.json();

    const normQuery = this._normalize(query);

    const filtered = all.filter(c => {
      const common = this._normalize(c?.name?.common);
      return common.startsWith(normQuery);
    });

    filtered.sort((a, b) => {
      const ca = this._normalize(a?.name?.common);
      const cb = this._normalize(b?.name?.common);

      return ca.length - cb.length || ca.localeCompare(cb);
    });

    if (!filtered.length && !emptyWhenNoMatch) {
      throw new Error('Country not found');
    }

    return filtered;
  }

  async getByCodes(codes = []) {
    if (!Array.isArray(codes) || codes.length === 0) return [];
    const url = `${this.baseUrl}/alpha?codes=${codes.map(c => encodeURIComponent(c)).join(',')}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch neighbors');
    return res.json(); 
  }

}

