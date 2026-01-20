export default class AppController {
  constructor({ bus, countryModel, historyModel, favoritesModel, viewStateModel, views }) {
    this.bus = bus;
    this.countryModel = countryModel;
    this.historyModel = historyModel;
    this.favoritesModel = favoritesModel;
    this.viewStateModel = viewStateModel;
    this.views = views;

    this._wire();
    this._init();
  }

  _wire() {
    this.bus.on('search:requested', async ({ query }) => {
      if (!query) {
        this.bus.emit('state:message', 'Please enter a country name');
        this.views.country.clear();
        return;
      }
      await this.countryModel.search(query);
      const current = this.countryModel.getCurrent();
      if (current?.name?.common) {
        const added = this.historyModel.add(current.name.common);
      }
    });

    this.bus.on('favorites:toggleRequested', ({ countryName, isFavorite }) => {
      this.favoritesModel.toggle(countryName, isFavorite);
    });

    
    this.bus.on('country:changed', (country) => {
        const list = this.favoritesModel.all();
        this.views.country.render(country, list);
    });


    this.bus.on('favorites:changed', (list) => {
      this.views.favorites.render(list);

      const name = this.countryModel.getCurrent()?.name?.common;
      if (name) this.views.country.setFavoriteState(name, list.includes(name));
    });

    this.bus.on('history:changed', (list) => {
      this.views.history.render(list);
    });

    
    this.bus.on('state:changed', ({ loading, message }) => {
      const s = this.views.status;

      if (loading) {
        s.innerHTML = `
          <span class="sr-only">Loading…</span>
          <div class="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 border-t-amber-500 rounded-full animate-spin"></div>
        `;
      } else if (message) {
        s.textContent = message;  
      } else {
        s.textContent = '';   
      }
    });

    this.bus.on('neighbors:changed', (neighbors) => {
      if (this.views.neighbors?.render){
        this.views.neighbors.render(neighbors);
      }
    });
  }

  _init() {
    this.bus.emit('history:changed', this.historyModel.all());
    this.bus.emit('favorites:changed', this.favoritesModel.all());
    this.bus.emit('state:changed', this.viewStateModel.get());
  }
}
