class WeakPasswordObserver {
    constructor() {
      this.subscribers = [];
    }
  
    subscribe(callback) {
      if (typeof callback === "function") {
        this.subscribers.push(callback);
      }
    }
  
    unsubscribe() {
      this.subscribers = [];
    }
  
    notify(message) {
      this.subscribers.forEach((callback) => callback(message));
    }
  
    checkPassword(password) {
      const weaknessMessage = this.validateWeakness(password);
      this.notify(weaknessMessage);
    }
  
    validateWeakness(password) {
      if (password.length < 8) {
        return "Password is too short. Minimum 8 characters required.";
      }
      if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter.";
      }
      if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number.";
      }
      if (!/[!@#$%^&*()_+[\]{}|;:,.<>?]/.test(password)) {
        return "Password must contain at least one special character.";
      }
      return null; // Password is strong
    }
  }
  
  export default WeakPasswordObserver;