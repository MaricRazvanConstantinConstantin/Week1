class UIRenderer {
  constructor() {
    this.container = null;
  }

  _initContainer() {
    this.container = document.getElementById('card-container');
    if (!this.container) {
      throw new Error('Container with ID "card-container" not found');
    }
  }

  clear() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  renderCard(data) {
    const html = `
      <div class="card">
        <div class="card-grid">
          <div class="col-flag">
            <div class="flag">${
              data.flag ? `<img src="${data.flag}" alt="Flag of ${data.name}">` : ''
            }</div>
          </div>
          <div class="col-main info">
            <h2>${data.name}</h2>
            <p><strong>Capital:</strong> ${data.capital}</p>
            <p><strong>Language(s):</strong> ${data.languages}</p>
            <p class="map"><a href="${data.mapsUrl}" target="_blank" rel="noopener">View on Google Maps</a></p>
          </div>
          <div class="col-side">
            <p><strong>Population:</strong> ${data.population}</p>
            <p><strong>Currency:</strong> ${data.currency}</p>
          </div>
        </div>
      </div>
    `;
    if (this.container) {
      this.container.innerHTML = html;
    }
  }

  renderHistory(countries){
    const historyContainer = document.getElementById('history-container');

    if (!countries || countries.length === 0) {
      historyContainer.innerHTML = '';
      return;
    }

    let historyHTML = countries.map(country => `<div class="history-item" data-country="${country}">${country}</div>`).join('');

    const html = `<div class="history-list">${historyHTML}</div>`;
    historyContainer.innerHTML = html;

    document.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', (event) => {
          const countryName = event.target.getAttribute('data-country');

          const customEvent = new CustomEvent('historyItemClicked', { detail: { countryName } });
          document.dispatchEvent(customEvent);
      });
    });
  }

  buildUI() {
    const body = document.querySelector('body');
    body.innerHTML = '';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'search-input';
    input.placeholder = 'Type a country name…';
    input.style.marginRight = '8px';

    const button = document.createElement('button');
    button.id = 'search-button';
    button.textContent = 'Search';

    const controls = document.createElement('div');
    controls.className = 'controls';
    controls.appendChild(input);
    controls.appendChild(button);

    const status = document.createElement('div');
    status.id = 'status';
    status.className = 'status';

    const historyContainer = document.createElement('div');
    historyContainer.id = 'history-container';

    const cardContainer = document.createElement('div');
    cardContainer.id = 'card-container';

    const title = document.createElement('h1');
    title.className = 'app-title';
    title.textContent = 'Search countries';

    const container = document.createElement('div');
    container.className = 'container';
    container.appendChild(title);
    container.appendChild(controls);
    container.appendChild(status);
    container.appendChild(historyContainer);
    container.appendChild(cardContainer);

    body.appendChild(container);

    this._initContainer();

    return {
      input,
      button,
      status,
      historyContainer,
      cardContainer,
    };
  }
}

export default UIRenderer;
