class StateManager {
  constructor() {
    this.state = {
      loading: false,
      message: '',
      results: null,
    };
    this.observers = [];
  }

  subscribe(callback) {
    this.observers.push(callback);
  }

  notifyObservers() {
    this.observers.forEach((callback) => callback(this.state));
  }

  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notifyObservers();
  }

  getState() {
    return this.state;
  }

  setLoading(isLoading) {
    this.setState({ loading: isLoading });
  }

  setMessage(message) {
    this.setState({ message });
  }

  setResults(results) {
    this.setState({ results, loading: false });
  }
}

export default StateManager;
