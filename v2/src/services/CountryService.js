
export default class CountryService {
  constructor(baseUrl = 'https://restcountries.com/v3.1') {
    this.baseUrl = baseUrl;
  }
  async searchByName(name) {
    const res = await fetch(`${this.baseUrl}/name/${encodeURIComponent(name)}`);
    if (!res.ok) throw new Error('Country not found');
    return res.json();
  }
}
