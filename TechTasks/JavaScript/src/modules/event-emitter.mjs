// Event Emmiter

// Event Emmiter should have:
// on - method to subscribe
// off - method to unsubscribe
// dispatch - method

// EventEmmiter to be implemented here

export class EventEmitter {
  constructor() {
    this.eventStorage = new Map();
  }

  on(eventName, callback) {
    if (typeof callback !== "function") {
      console.error(`${callback} is not a function`);
    }

    if (!this.eventStorage.has(eventName)) {
      this.eventStorage.set(eventName, new Set());
    }

    this.eventStorage.get(eventName).add(callback);

    return this;
  }

  off(eventName, callback) {
    if (!this.eventStorage.has(eventName)) {
      return this;
    }

    this.eventStorage.get(eventName).delete(callback);

    if (this.eventStorage.get(eventName).size === 0) {
      this.eventStorage.delete(eventName);
    }

    return this;
  }

  dispatch(eventName, ...args) {
    for (let callback of this.eventStorage.get(eventName)) {
      callback(...args);
    }

    return this;
  }
}

// Usage example

const emitter = new EventEmitter();

const fn1 = (arg) => console.log(arg);
const fn2 = () => console.log(2);

emitter.on("some_event", fn1);
emitter.on("some_event", fn2);
emitter.on("another_event", fn2);

emitter.dispatch("some_event", "test");

emitter.off("some_event", fn1);
emitter.dispatch("some_event");
