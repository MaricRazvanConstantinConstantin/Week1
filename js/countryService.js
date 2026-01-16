class CountryService {
  constructor(baseUrl = 'https://restcountries.com/v3.1') {
    this.baseUrl = baseUrl;
  }

  async searchByName(countryName) {
    const url = `${this.baseUrl}/name/${encodeURIComponent(countryName)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Country not found');
    }

    return response.json();
  }
}

export default CountryService;
