class HistoryManager {
    static STORAGE_KEY = 'countrySearchHistory';
    static MAX_HISTORY_SIZE = 10;

    constructor() {
    }

    loadHistory() {
        try {
            const stored = localStorage.getItem(HistoryManager.STORAGE_KEY);

            if (!stored) {
                return [];
            }

            const history = JSON.parse(stored);
            return Array.isArray(history) ? history : [];
        } catch (error) {
            console.error('Error loading history:', error);
            return [];
        }
    }

    saveHistory(historyArray) {
        try {
            const jsonString = JSON.stringify(historyArray);

            localStorage.setItem(HistoryManager.STORAGE_KEY, jsonString);

            return true;
        } catch (error) {
            console.error('Error saving history:', error);
            return false;
        }
    }

    addCountry(countryName) {
        if (!countryName || countryName.trim() === '') {
            return this.getHistory();
        }

        let history = this.loadHistory();

        history = history.filter(name => name.toLowerCase() !== countryName.toLowerCase());
        
        history.unshift(countryName);

        if (history.length > HistoryManager.MAX_HISTORY_SIZE) {
            history = history.slice(0, HistoryManager.MAX_HISTORY_SIZE);
        }

        this.saveHistory(history);
        return history;

    }

    getHistory() {
        return this.loadHistory();
    }

    clearHistory() {
        try {
            localStorage.removeItem(HistoryManager.STORAGE_KEY);
            return [];
        } catch (error) {
            console.error('Error clearing history:', error);
            return [];
        }
    }
}

export default HistoryManager;