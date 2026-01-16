# Country Search Application - SOLID Architecture

## Project Structure

```
Week1/
├── country_search.html
├── js/
│   ├── app.js                 # Main application controller
│   ├── countryService.js      # API service layer
│   ├── dataFormatter.js       # Data transformation
│   ├── uiRenderer.js          # UI rendering
│   └── stateManager.js        # State management
└── README.md
```

## SOLID Principles Implementation

### 1. **Single Responsibility Principle (SRP)**

Each module has a single, well-defined responsibility:

- **countryService.js**: Handles API calls only
- **uiRenderer.js**: Manages DOM creation and rendering
- **dataFormatter.js**: Transforms raw data into UI-ready format
- **stateManager.js**: Manages application state
- **app.js**: Orchestrates module interactions

### 2. **Open/Closed Principle (OCP)**

- **DataFormatter** can be extended with new formatting methods without modifying existing ones
- UI rendering can be enhanced by adding new render methods to UIRenderer
- New data sources can be added without changing the app logic

### 3. **Liskov Substitution Principle (LSP)**

- StateManager follows a consistent interface that any observer can consume
- All modules expose predictable, consistent APIs
- Services can be replaced with alternative implementations without breaking the app

### 4. **Interface Segregation Principle (ISP)**

- Each module exports only the methods it needs
- No client depends on interfaces it doesn't use
- Modules have minimal, focused public APIs

### 5. **Dependency Inversion Principle (DIP)**

- `App` depends on abstractions (StateManager, UIRenderer) not concrete implementations
- Services are injected and loosely coupled
- State changes are communicated through the observer pattern, not direct dependencies

## Module Descriptions

### `countryService.js`

- Handles all API communication
- Single method: `searchByName(countryName)`
- Throws descriptive errors for failed requests

### `dataFormatter.js`

- Transforms raw API data into standardized format
- Static methods for formatting:
  - `formatCountry()` - main formatter
  - `formatCapital()`, `formatLanguages()`, `formatPopulation()`, etc.
- Easy to extend with new formatters

### `uiRenderer.js`

- Creates DOM structure with `buildUI()`
- Renders country cards with `renderCard()`
- Manages container operations with `clear()`
- Decoupled from state management

### `stateManager.js`

- Observable state management
- Methods: `setState()`, `getState()`, `subscribe()`, `setLoading()`, `setMessage()`, `setResults()`
- Notifies all observers of state changes

### `app.js`

- Main application controller
- Orchestrates all modules
- Handles user interactions and search flow
- Updates UI based on state changes

## How to Use

1. Open `country_search.html` in a web browser
2. Enter a country name in the search field
3. Click "Search" or press Enter
4. View the country information card

## Benefits of This Architecture

✅ **Maintainability**: Each module is independent and easy to understand
✅ **Testability**: Modules can be tested in isolation
✅ **Scalability**: New features can be added without modifying existing code
✅ **Reusability**: Modules can be used in other projects
✅ **Flexibility**: Easy to swap implementations or add new features
✅ **Debugging**: Issues are localized to specific modules

## Future Enhancements

- Add error boundary component
- Implement caching layer
- Add pagination for multiple results
- Create custom hooks for state management
- Add unit tests for each module
- Implement TypeScript for type safety
