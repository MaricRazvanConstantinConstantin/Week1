export default class RootView {
  build() {

    document.body.innerHTML = '';

    
    const header = document.createElement('header');

    header.className = `
      w-full
      bg-white dark:bg-slate-900
      border-b border-slate-200 dark:border-slate-700
      shadow-sm
      px-6 py-4
      flex items-center justify-between
    `;

    const title = document.createElement('h1');
    title.className = `
      text-2xl md:text-3xl font-bold
      text-slate-900 dark:text-slate-100
      tracking-tight
    `;
    title.textContent = 'Search Countries';

    const headerRight = document.createElement('div');
    headerRight.className = 'flex items-center gap-3';

    header.append(title, headerRight);

    const layout = document.createElement('div');
    layout.className = 'layout-grid';

    const sidebarLeft = document.createElement('aside');
    sidebarLeft.className = 'sidebar-left';
    const navPanel = document.createElement('nav');
    navPanel.className = 'nav-panel';
    navPanel.innerHTML = `
      <h2 class="nav-title">Navigation</h2>
      <ul class="nav-list">
        <li><button class="nav-item" data-nav="overview" disabled>Overview</button></li>
        <li><button class="nav-item" data-nav="statistics" disabled>Statistics</button></li>
        <li><button class="nav-item" data-nav="map" disabled>Map</button></li>
        <li><button class="nav-item" data-nav="culture" disabled>Culture</button></li>
      </ul>
    `;
    sidebarLeft.appendChild(navPanel);

    const main = document.createElement('main');
    main.className = 'main-content';

    const searchSection = document.createElement('section');
    searchSection.className = 'search-section';
    
    searchSection.innerHTML = `
      <div class="search-bar flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
        <input
          type="text"
          id="search-input"
          placeholder="Search for a country..."
          class="flex-1 bg-transparent outline-none     text-slate-800 dark:text-slate-100
          placeholder-slate-400 dark:placeholder-slate-500 text-base px-2
          focus:ring-2 focus:ring-amber-500/30 rounded-md"
        />
        <button
          id="search-button"
          type="button"
          class="px-4 py-2 rounded-lg text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 shadow-sm transition font-medium"
        >
          Search
        </button>
      </div>

      <div id="status" class="status min-h-[24px] text-sm text-slate-600 dark:text-slate-300 mt-2 flex items-center gap-2"></div>

      <div id="history-container" class="search-history mt-3"></div>

      <div id="card-container" class="country-details mt-4"></div>
    `;

    main.appendChild(searchSection);

    const sidebarRight = document.createElement('aside');
    
    sidebarRight.className = `
      sidebar-right
      bg-white dark:bg-slate-900
      rounded-xl shadow-md
      ring-1 ring-slate-200 dark:ring-slate-700
      p-4
      flex flex-col gap-4
      max-h-[85vh] overflow-y-auto
    `;

    const favoritesPanel = document.createElement('section');
    favoritesPanel.className = 'favorites-panel';
    
    favoritesPanel.innerHTML = `
      <div id="favorites-container" class="favorites-list scrollable"></div>
    `;

    sidebarRight.appendChild(favoritesPanel);

    layout.append(sidebarLeft, main, sidebarRight);
    document.body.append(header, layout);

    return {
      input: searchSection.querySelector('#search-input'),
      searchButton: searchSection.querySelector('#search-button'),
      status: searchSection.querySelector('#status'),
      historyContainer: searchSection.querySelector('#history-container'),
      cardContainer: searchSection.querySelector('#card-container'),
      favoritesContainer: favoritesPanel.querySelector('#favorites-container'),
      header,
      sidebarLeft,
      sidebarRight,
      main,
    };
  }
}

