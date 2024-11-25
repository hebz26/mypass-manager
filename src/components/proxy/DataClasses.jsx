//abstract class
class Data {
  mask() {
    throw new Error("Method 'mask()' must be implemented.");
  }

  unmask() {
    throw new Error("Method 'unmask()' must be implemented.");
  }
}

//class for the actual data
class RealData extends Data {
  constructor(data) {
    super();
    this.data = data;
  }

  mask() {
    if (!this.data) return "";

    const length = this.data.length;

    // Return a string of '*' characters equal to the length of the data
    return "*".repeat(length);
  }

  unmask() {
    return this.data;
  }
}

//proxy class that uses realData
class ProxyData extends Data {
  constructor(realData) {
    super();
    this.realData = realData;
  }

  mask() {
    return this.realData.mask();
  }

  unmask() {
    return this.realData.unmask();
  }
}

export { Data, RealData, ProxyData };
