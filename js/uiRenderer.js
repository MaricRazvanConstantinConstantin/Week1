class UIRenderer {
  constructor(favoriteManager) {
    console.log("UIRenderer received favorites:", favoriteManager);
    this.favoriteManager = favoriteManager;
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
    const isFavorite = this.favoriteManager
      .getFavorites()
      .includes(data.name);

    const html = `
      <div class="card">
        <button
          class="favorite-btn ${isFavorite ? 'is-active' : ''}"
          type="button"
          aria-label="Toggle favorite"
          title="Toggle favorite"
          data-country="${data.name}">
          <svg class="star" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor"
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.25l-7.19-.61L12 2 9.19 8.64 2 
                9.25l5.46 4.72L5.82 21z"/>
          </svg>
        </button>

        <div class="card-grid">
          <div class="col-flag">
            <div class="flag">
              ${data.flag
                ? `<img src="${data.flag}" alt="Flag of ${data.name}"/>`
                : ''}
            </div>
          </div>
          <div class="col-main info">
            <h2>${data.name}</h2>
            <p><strong>Capital:</strong> ${data.capital}</p>
            <p><strong>Language(s):</strong> ${data.languages}</p>
            <p class="map">
              <a href="${data.mapsUrl}">
                View on Google Maps
              </a>
            </p>
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

    const favBtn = this.container.querySelector('.favorite-btn');

    if (favBtn) {
      favBtn.addEventListener('click', () => {
        const countryName = favBtn.getAttribute('data-country');
        const currentlyActive = favBtn.classList.contains('is-active');
        const newState = !currentlyActive;

        favBtn.classList.toggle('is-active', newState);

        const event = new CustomEvent('favoriteToggled', {
          detail: {
            countryName,
            isFavorite: newState,
          },
        });

        document.dispatchEvent(event);
      });
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

    const searchButton = document.createElement('button');
    searchButton.id = 'search-button';
    searchButton.textContent = 'Search';

    const controls = document.createElement('div');
    controls.className = 'controls';
    controls.appendChild(input);
    controls.appendChild(searchButton);

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
      searchButton,
      status,
      historyContainer,
      cardContainer,
    };
  }
}

export default UIRenderer;
