
export default class RootView {
  build() {
    const body = document.body;
    body.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'container';

    const title = Object.assign(document.createElement('h1'), { className: 'app-title', textContent: 'Search countries' });

    const controls = Object.assign(document.createElement('div'), { className: 'controls' });
    const input = Object.assign(document.createElement('input'), { id: 'search-input', type: 'text', placeholder: 'Type a country name…', style: 'margin-right:8px' });
    const searchButton = Object.assign(document.createElement('button'), { id: 'search-button', textContent: 'Search' });
    controls.append(input, searchButton);

    const status = Object.assign(document.createElement('div'), { id: 'status', className: 'status' });

    const historyContainer = Object.assign(document.createElement('div'), { id: 'history-container' });
    const cardContainer = Object.assign(document.createElement('div'), { id: 'card-container' });
    const favoritesContainer = Object.assign(document.createElement('div'), { id: 'favorites-container' });

    container.append(title, controls, status, historyContainer, cardContainer, favoritesContainer);
    body.appendChild(container);

    return { input, searchButton, status, historyContainer, cardContainer, favoritesContainer };
  }
}
``
