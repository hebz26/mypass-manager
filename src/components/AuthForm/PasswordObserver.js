// Observer Pattern: Weak password warning components

class Subject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notifyObservers(message) {
    this.observers.forEach((observer) => observer.update(message));
  }
}

class WeakPasswordObserver {
  update(message) {
    alert(message); // Display a warning for weak passwords
  }
}

export { Subject, WeakPasswordObserver };
