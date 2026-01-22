import EventBus from './core/EventBus.js';

import CountryService from './services/CountryService.js';

import CountryModel from './models/CountryModel.js';
import FavoritesModel from './models/FavoritesModel.js';
import HistoryModel from './models/HistoryModel.js';
import ViewStateModel from './models/ViewStateModel.js';

import RootView from './views/RootView.js';
import SearchView from './views/SearchView.js';
import CountryView from './views/CountryView.js';
import FavoritesView from './views/FavoritesView.js';
import HistoryView from './views/HistoryView.js';
import ThemeView from './views/ThemeView.js';

import AppController from './controllers/AppController.js';
import NeighborsView from './views/NeighborsView.js';

async function bootstrap() {
  const bus = new EventBus();

  const service = new CountryService();
  const countryModel = new CountryModel(service, bus);
  const favoritesModel = new FavoritesModel(bus);
  const historyModel = new HistoryModel(bus);
  const viewStateModel = new ViewStateModel(bus);

  const root = await new RootView().build();

  const searchView = new SearchView(bus, root.input, root.searchButton);
  const countryView = new CountryView(bus, root.cardContainer);
  const favoritesView = new FavoritesView(bus, root.favoritesContainer);
  const historyView = new HistoryView(bus, root.historyContainer);
  const neighborsView = new NeighborsView(
    bus,
    root.neighborsContainer,
    root.neighborsToggle
  );
  const themeView = new ThemeView(root.themeMount);
  themeView.render();

  new AppController({
    bus,
    countryModel,
    favoritesModel,
    historyModel,
    viewStateModel,
    views: {
      search: searchView,
      country: countryView,
      favorites: favoritesView,
      history: historyView,
      neighbors: neighborsView,
      status: root.status,
    },
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

