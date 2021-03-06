function call(fn, ...args) {
  const validator = (fn.eadFn || fn).validator;
  if (validator) validator(...args);
  return {
    type: "call",
    fn,
    args
  };
}

function callFn(fn, ...args) {
  return {
    type: "callFn",
    fn,
    args
  };
}

function callFnBound(bindThis, fn, ...args) {
  return {
    type: "callFn",
    fn,
    bindThis,
    args
  };
}

function callCallback(fn, ...args) {
  return {
    type: "callCallback",
    fn,
    args
  };
}

function callCallbackBound(bindThis, fn, ...args) {
  return {
    type: "callCallback",
    fn,
    bindThis,
    args
  };
}

function echo(message) {
  return {
    type: "echo",
    message
  };
}

function noop() {
  return {
    type: "noop"
  };
}

function globalVariable(name) {
  if (!name) throw new Error("name required");
  return {
    type: "globalVariable",
    name
  };
}

function log(...args) {
  return {
    type: "log",
    args
  };
}

function logError(...args) {
  return {
    type: "logError",
    args
  };
}

function setImmediateCmd(cmd, resetStack) {
  return {
    type: "setImmediate",
    cmd,
    resetStack
  };
}

function setTimeoutCmd(cmd, time, resetStack) {
  return {
    type: "setTimeout",
    cmd,
    time,
    resetStack
  };
}

function clearTimeoutCmd(id) {
  return {
    type: "clearTimeout",
    id
  };
}

function setIntervalCmd(cmd, time, resetStack) {
  return {
    type: "setInterval",
    cmd,
    time,
    resetStack
  };
}

function clearIntervalCmd(id) {
  return {
    type: "clearInterval",
    id
  };
}

function sleep(time) {
  return {
    type: "sleep",
    time
  };
}

function series(cmdList) {
  return {
    type: "series",
    cmdList
  };
}

function parallel(cmdList) {
  return {
    type: "parallel",
    cmdList
  };
}

function envelope(cmd) {
  return {
    type: "envelope",
    cmd
  };
}

function now() {
  return {
    type: "now"
  };
}

function either(cmd, defaultValue) {
  return {
    type: "either",
    cmd,
    defaultValue
  };
}

function getState(path, defaultValue) {
  return {
    type: "getState",
    path,
    defaultValue
  };
}

function setState(path, value) {
  return {
    type: "setState",
    path,
    value
  };
}

function clearState() {
  return {
    type: "clearState"
  };
}

// Friendly aliases
call.fn = callFn;
call.fnBound = callFnBound;
call.callback = callCallback;
call.callbackBound = callCallbackBound;

module.exports = {
  call,
  callFn,
  fn: callFn,
  callFnBound,
  callCallback,
  callback: callCallback,
  callCallbackBound,
  echo,
  noop,
  now,
  globalVariable,
  log,
  logError,
  setImmediate: setImmediateCmd,
  setTimeout: setTimeoutCmd,
  clearTimeout: clearTimeoutCmd,
  setInterval: setIntervalCmd,
  clearInterval: clearIntervalCmd,
  sleep,
  series,
  parallel,
  envelope,
  either,
  getState,
  setState,
  clearState
};
