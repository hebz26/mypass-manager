// Builder Pattern: Password generation components

class Password {
  constructor(password) {
    this.password = password;
  }
}

class PasswordBuilder {
  constructor() {
    this.length = 8; // Default length
    this.includeUppercase = false;
    this.includeNumbers = false;
    this.includeSymbols = false;
  }

  setLength(length) {
    this.length = length;
    return this;
  }

  addUppercase() {
    this.includeUppercase = true;
    return this;
  }

  addNumbers() {
    this.includeNumbers = true;
    return this;
  }

  addSymbols() {
    this.includeSymbols = true;
    return this;
  }

  build() {
    let charset = "abcdefghijklmnopqrstuvwxyz";
    if (this.includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (this.includeNumbers) charset += "0123456789";
    if (this.includeSymbols) charset += "!@#$%^&*()";

    let password = "";
    for (let i = 0; i < this.length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    return new Password(password);
  }
}

export default PasswordBuilder;
