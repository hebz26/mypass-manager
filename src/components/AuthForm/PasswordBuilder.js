class Password {
    constructor(password) {
      this.password = password || '';
    }
  
    addCharacter(character) {
      this.password += character;
    }
  
    // method to complete the password to 8 characters and shuffle the characters
    completePassword() {
      const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
      while (this.password.length < 8) {
        this.password += characters[Math.floor(Math.random() * characters.length)];
      }
  
      // shuffle the password
      this.password = this.password.split('').sort(() => Math.random() - 0.5).join('');
    }
  
    // rturn the generated password
    getPassword() {
      return this.password;
    }
  }
  
  class PasswordBuilder {
    constructor() {
      this.password = new Password();
    }
  
    addLowercase() {
      const lowercase = 'abcdefghijklmnopqrstuvwxyz';
      this.password.addCharacter(lowercase[Math.floor(Math.random() * lowercase.length)]);
      return this;
    }
  
    addUppercase() {
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      this.password.addCharacter(uppercase[Math.floor(Math.random() * uppercase.length)]);
      return this;
    }
  
    addNumber() {
      const numbers = '0123456789';
      this.password.addCharacter(numbers[Math.floor(Math.random() * numbers.length)]);
      return this;
    }
  
    addSymbol() {
      const symbols = '!@#$%^&*()';
      this.password.addCharacter(symbols[Math.floor(Math.random() * symbols.length)]);
      return this;
    }
  
    completePassword() {
      this.password.completePassword();
      return this;
    }
  
    generatePassword() {
      // start with an empty password
      this.password = new Password();
      // add at least one lowercase, one uppercase, one number, and one symbol
      this.addLowercase().addUppercase().addNumber().addSymbol();
      this.completePassword();
      return this.password.getPassword();
    }
  }
  
  // director class to construct the password
  class PasswordDirector {
    constructor(builder) {
      this.builder = builder;
    }
  
    buildStrongPassword() {
      return this.builder.generatePassword();
    }
  }
  
  // exports both builder and director 
  export { PasswordBuilder, PasswordDirector };
  