const storageCache = {};

export default mock = {
  setItem: jest.fn((key, value) => {
    return new Promise((resolve, reject) => {
      try {
        if (!(typeof key === "string" || key instanceof String)) {
          key = JSON.stringify(key);
        }
        if (!(typeof value === "string" || value instanceof String)) {
          value = JSON.stringify(value);
        }
        storageCache[key] = value;
        resolve();
      }
      catch (err) {
        reject(err);
      }
    })
  }),

  getItem: jest.fn((key) => {
    return new Promise((resolve) => {
      return storageCache.hasOwnProperty(key)
        ? resolve(storageCache[key])
        : resolve(null);
    });
  }),

  removeItem: jest.fn((key) => {
    return new Promise((resolve, reject) => {
      return storageCache.hasOwnProperty(key)
        ? resolve(delete storageCache[key])
        : reject();
    });
  }),
}
