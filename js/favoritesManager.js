class FavoritesManager {
    static STORAGE_KEY = 'favoriteCountries';

    constructor() {
    }

    loadFavorites() {
        try{
            const stored = localStorage.getItem(FavoritesManager.STORAGE_KEY);

            if (!stored) {
                return [];
            }

            const favorites = JSON.parse(stored);
            return Array.isArray(favorites) ? favorites : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    saveFavorites(favoritesArray) {
        try {
            const jsonString = JSON.stringify(favoritesArray);

            localStorage.setItem(FavoritesManager.STORAGE_KEY, jsonString);

            return true;
        } catch (error) {
            console.error('Error saving favorites:', error);
            return false;
        }
    }

    addCountry(countryName) {
        const currentFavorites = this.loadFavorites();
        if (!currentFavorites.includes(countryName)) {
            currentFavorites.push(countryName);
            this.saveFavorites(currentFavorites);
        }

    }

    removeCountry(countryName) {
        let currentFavorites = this.loadFavorites();
        currentFavorites = currentFavorites.filter(name => name.toLowerCase() !== countryName.toLowerCase());
        this.saveFavorites(currentFavorites);
    }

    getFavorites() {
        return this.loadFavorites();
    }
}
export default FavoritesManager;