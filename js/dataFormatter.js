class DataFormatter {
  static formatCountry(country) {
    return {
      name: country?.name?.common || '—',
      flag: country?.flags?.svg || country?.flags?.png || '',
      capital: this.formatCapital(country?.capital),
      languages: this.formatLanguages(country?.languages),
      population: this.formatPopulation(country?.population),
      currency: this.formatCurrency(country?.currencies),
      mapsUrl: this.formatMapsUrl(country),
    };
  }

  static formatCapital(capital) {
    return capital && capital.length > 0 ? capital[0] : '—';
  }

  static formatLanguages(languages) {
    return languages ? Object.values(languages).join(', ') : '—';
  }

  static formatPopulation(population) {
    return population ? Number(population).toLocaleString() : '—';
  }

  static formatCurrency(currencies) {
    if (!currencies) return '—';
    const currency = Object.values(currencies)[0];
    return currency
      ? currency.name + (currency.symbol ? ` (${currency.symbol})` : '')
      : '—';
  }

  static formatMapsUrl(country) {
    const googleMapsUrl = country?.maps?.googleMaps;
    if (googleMapsUrl) return googleMapsUrl;

    const latlng = country?.capitalInfo?.latlng || country?.latlng;
    if (latlng) {
      return `https://www.google.com/maps/search/?api=1&query=${latlng[0]},${latlng[1]}`;
    }

    return '#';
  }
}

export default DataFormatter;
