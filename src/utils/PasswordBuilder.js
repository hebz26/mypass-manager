class PasswordBuilder {
    constructor() {
      this.length = 8; // Default length
      this.includeUppercase = false;
      this.includeNumbers = false;
      this.includeSpecialCharacters = false;
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
      this.includeSpecialCharacters = true;
      return this;
    }
  
    build() {
      const charSet = [];
      if (this.includeUppercase) charSet.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
      charSet.push("abcdefghijklmnopqrstuvwxyz");
      if (this.includeNumbers) charSet.push("0123456789");
      if (this.includeSpecialCharacters) charSet.push("!@#$%^&*()_+[]{}|;:,.<>?/");
  
      if (charSet.length === 0) {
        throw new Error("No character types selected for password generation.");
      }
  
      const fullCharSet = charSet.join('');
      let password = '';
      for (let i = 0; i < this.length; i++) {
        password += fullCharSet[Math.floor(Math.random() * fullCharSet.length)];
      }
      return password;
    }
  }
  
  export default PasswordBuilder;