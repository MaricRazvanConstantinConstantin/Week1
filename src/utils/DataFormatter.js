
export default class DataFormatter {
  static formatCountry(country) {
    return {
      name: country?.name?.common || '—',
      flag: country?.flags?.svg || country?.flags?.png || '',
      capital: country?.capital?.[0] ?? '—',
      languages: country?.languages ? Object.values(country.languages).join(', ') : '—',
      population: country?.population ? Number(country.population).toLocaleString() : '—',
      currency: this._currency(country?.currencies),
      mapsUrl: this._maps(country),
    };
  }
  static _currency(currencies) {
    if (!currencies) return '—';
    const c = Object.values(currencies)[0];
    return c ? `${c.name}${c.symbol ? ` (${c.symbol})` : ''}` : '—';
  }
  static _maps(c) {
    const gm = c?.maps?.googleMaps;
    if (gm) return gm;
    const latlng = c?.capitalInfo?.latlng || c?.latlng;
    return latlng ? `https://www.google.com/maps/search/?api=1&query=${latlng[0]},${latlng[1]}` : '#';
  }
}
