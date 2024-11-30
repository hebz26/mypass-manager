// Abstract Subject class
class Subject {
  // Methods for registering, unregistering,notifying an observer. Must be implemented by concrete classes.
  registerObserver(observer) {
    throw new Error("Method 'registerObserver' must be implemented.");
  }

  unregisterObserver(observer) {
    throw new Error("Method 'unregisterObserver' must be implemented.");
  }

  notifyObservers() {
    throw new Error("Method 'notifyObservers' must be implemented.");
  }
}

// Concrete Subject class
class ExpirationNotifier extends Subject {
  constructor() {
    super();
    this.observers = []; // List of observers to notify
    this.expirationDate = null; // the state we are observing (expiration date)
  }

  // Register/unregister an observer to be notified
  registerObserver(observer) {
    this.observers.push(observer);
  }

  unregisterObserver(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  // Set the expiration date and notify all observers of the change
  setExpirationDate(date) {
    this.expirationDate = date;
    this.notifyObservers();
  }

  // Notify observers that the expiration date has changed so it will require a check
  notifyObservers() {
    // Check if the expiration date is within 30 days from today
    const isExpiringSoon = this.checkExpiration(this.expirationDate);
    this.observers.forEach((observer) => observer.update(isExpiringSoon));
  }

  // Check if the expiration date is within 30 days
  checkExpiration(date) {
    const today = new Date(); // Get today's date
    const expirationDate = new Date(date); // Convert the string date to a Date object
    const timeDiff = expirationDate - today; // Get the difference in time
    const daysLeft = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days
    return daysLeft <= 30 && daysLeft >= 0; // Return true if expiration is within 30 days
  }
}

// Abstract Observer class
class Observer {
  // Method that gets called when the observable state changes
  update(isExpiringSoon) {
    throw new Error("Method 'update' must be implemented.");
  }
}

// Concrete Observer class: A concrete observer that reacts to changes
class DateObserver extends Observer {
  constructor(updateCallback) {
    super();
    this.updateCallback = updateCallback; // The callback function that will handle the update
  }

  // The update method is called when the subject notifies the observer
  update(isExpiringSoon) {
    this.updateCallback(isExpiringSoon);
  }
}

export { ExpirationNotifier, DateObserver };
