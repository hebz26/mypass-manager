import { useState, useEffect } from "react";

// observer interface
class Observer {
  update() {
    throw new Error("Observer's update method must be implemented");
  }
}

// subject class
class Subject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notifyObservers() {
    this.observers.forEach((observer) => observer.update());
  }
}

// ConcreteObserver class
class ConcreteObserver extends Observer {
  constructor(password, setIsWeakPassword) {
    super();
    this.password = password;
    this.setIsWeakPassword = setIsWeakPassword;
  }

  update() {
    const minLength = this.password.length >= 8;
    const hasLowercase = /[a-z]/.test(this.password);
    const hasUppercase = /[A-Z]/.test(this.password);
    const hasNumber = /\d/.test(this.password);
    const hasSymbol = /[!@#$%^&*()]/.test(this.password);

    if (minLength && hasLowercase && hasUppercase && hasNumber && hasSymbol) {
      this.setIsWeakPassword(false); // the password is strong
    } else {
      this.setIsWeakPassword(true); // the password is weak
    }
  }
}

// ConcreteSubject Class
class ConcreteSubject extends Subject {
  constructor(password) {
    super();
    this._password = password;
  }

  set password(value) {
    this._password = value;
    this.notifyObservers(); // notify all observers when password changes
  }

  get password() {
    return this._password;
  }
}

// the hook that serves as an observer in a React context
const useWeakPasswordObserver = (password) => {
  const [isWeakPassword, setIsWeakPassword] = useState(true);

  useEffect(() => {
    // create a ConcreteSubject instance for password
    const passwordSubject = new ConcreteSubject(password);

    // creat an observer for password changes
    const passwordObserver = new ConcreteObserver(password, setIsWeakPassword);

    // add the observer to the subject
    passwordSubject.addObserver(passwordObserver);

    // triggers the observer update whenever password changes
    passwordSubject.password = password;

    return () => {
      passwordSubject.removeObserver(passwordObserver);
    };
  }, [password]);

  return isWeakPassword;
};

export default useWeakPasswordObserver;
