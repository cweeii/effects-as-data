const core = require("./core");
const coreCmds = require("./cmds");
const coreInterpreters = require("./interpreters");

let interpreters = Object.assign({}, coreInterpreters);
let context = {};

function promisify(fn) {
  if (fn.eadPromisified) return fn;
  const validator = fn.validator;
  const promised = function(...args) {
    if (validator) {
      try {
        validator(...args);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return core.call(context, interpreters, fn, ...args);
  };
  // try/catch because this is nice for reporting, but not
  // necessary for the system to function
  // Note: there is a unit test to validate this behavior
  // so errors, although swallowed here, are picked
  // up in the unit test.
  try {
    Object.defineProperty(promised, "name", {
      value: fn.name,
      writable: false
    });
  } catch (e) {}
  promised.eadFn = fn;

  promised.callWithContext = function(c, ...args) {
    if (validator) {
      try {
        validator(...args);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return core.call(Object.assign({}, context, c), interpreters, fn, ...args);
  };

  promised.eadPromisified = true;

  return promised;
}

function call(fn, ...args) {
  return promisify(fn)(...args);
}

function doCmd(cmd) {
  return promisify(function* doCmd() {
    return yield cmd;
  })();
}

function setContext(c) {
  context = c;
}

function getContext() {
  return context;
}

function addToContext(c) {
  context = Object.assign({}, context, c);
}

function setInterpreters(h) {
  interpreters = h;
}

function getInterpreters() {
  return interpreters;
}

function addInterpreters(h) {
  interpreters = Object.assign({}, interpreters, h);
}

function reset() {
  interpreters = {};
  context = {};
}

function onError(fn) {
  if (typeof fn !== "function") throw new Error("onError requires a function");
  addToContext({ onError: fn });
}

function effect(fn, validator) {
  if (validator !== undefined && typeof validator !== "function") {
    throw new Error("validator must be a function");
  }
  return function(...args) {
    if (typeof validator === "function") {
      validator(...args);
    }
    return coreCmds.call.fn(fn, ...args);
  };
}

module.exports = {
  cmds: coreCmds,
  interpreters: coreInterpreters,
  promisify,
  call,
  doCmd,
  setContext,
  getContext,
  addToContext,
  setInterpreters,
  getInterpreters,
  addInterpreters,
  reset,
  onError,
  effect
};
