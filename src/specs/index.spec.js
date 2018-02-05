const {
  call,
  echo,
  promisify,
  setContext,
  getContext,
  addToContext,
  setHandlers,
  getHandlers,
  addToHandlers,
  reset
} = require("../index");

test("promisify should tag function", async () => {
  function* test1(message) {
    return yield echo(message);
  }
  expect(promisify(test1).eadPromisified).toEqual(true);
});

test("promisify should name function", async () => {
  function* testName(message) {
    return yield echo(message);
  }
  expect(promisify(testName).name).toEqual("testName");
});

test("promisify should not double wrap", async () => {
  function* test1(message) {
    return yield echo(message);
  }
  const p = promisify(test1);
  expect(p).toEqual(promisify(p));
});

test("promisify should wrap up an effects-as-data function", async () => {
  function* test1(message) {
    return yield echo(message);
  }

  const result = await promisify(test1)("foo");
  expect(result).toEqual("foo");
});

test("promisify should handle errors", async () => {
  function* test1(message) {
    throw new Error("oops");
  }

  try {
    await promisify(test1)("foo");
  } catch (e) {
    expect(e.message).toEqual("oops");
    return;
  }
  fail("promisify did not reject");
});

test("call should call effects-as-data function", async () => {
  function* test1(message) {
    return yield call(test2, message);
  }

  function* test2(message) {
    return yield echo(message);
  }

  const result = await promisify(test1)("foo");
  expect(result).toEqual("foo");
});

test("[error handling] call should call effects-as-data function", async () => {
  function* test1(message) {
    return yield call(test2, message);
  }

  function* test2(message) {
    throw new Error("oops");
  }

  try {
    await promisify(test1)("foo");
  } catch (e) {
    expect(e.message).toEqual("oops");
    return;
  }
  fail("promisify did not reject");
});

test("call should call promisified function", async () => {
  function* test1(message) {
    return yield call(test2, message);
  }

  const test2 = promisify(function*(message) {
    return yield echo(message);
  });

  const result = await promisify(test1)("foo");
  expect(result).toEqual("foo");
});

test("[error handling] call should call promisified function", async () => {
  function* test1(message) {
    return yield call(test2, message);
  }

  const test2 = promisify(function*(message) {
    throw new Error("oops");
  });

  try {
    await promisify(test1)("foo");
  } catch (e) {
    expect(e.message).toEqual("oops");
    return;
  }
  fail("promisify did not reject");
});

test("call.fn should call promisified function", async () => {
  function* test1(message) {
    return yield call.fn(test2, message);
  }

  const test2 = promisify(function*(message) {
    return yield echo(message);
  });

  const result = await promisify(test1)("foo");
  expect(result).toEqual("foo");
});

test("[error handling] call.fn should call promisified function", async () => {
  function* test1(message) {
    return yield call.fn(test2, message);
  }

  const test2 = promisify(function*(message) {
    throw new Error("oops");
  });

  try {
    await promisify(test1)("foo");
  } catch (e) {
    expect(e.message).toEqual("oops");
    return;
  }
  fail("promisify did not reject");
});

test("call.fn should call promise returning function", async () => {
  function* test1(message) {
    return yield call.fn(test2, message);
  }

  function test2(message) {
    return Promise.resolve(message);
  }

  const result = await promisify(test1)("foo");
  expect(result).toEqual("foo");
});

test("[error handling] call.fn should call promise returning function", async () => {
  function* test1(message) {
    return yield call.fn(test2, message);
  }

  function test2(message) {
    throw new Error("oops");
  }

  try {
    await promisify(test1)("foo");
  } catch (e) {
    expect(e.message).toEqual("oops");
    return;
  }
  fail("promisify did not reject");
});

test("call.fnBound should call promise returning function", async () => {
  function* test1(message) {
    return yield call.fnBound(obj, obj.test2, message);
  }

  const obj = {
    value: "bar",
    test2(message) {
      return Promise.resolve(`${message}${this.value}`);
    }
  };

  const result = await promisify(test1)("foo");
  expect(result).toEqual("foobar");
});

test("[error handling] call.fnBound should call promise returning function", async () => {
  function* test1(message) {
    return yield call.fnBound(obj, obj.test2, message);
  }

  const obj = {
    value: "bar",
    test2(message) {
      throw new Error("oops");
    }
  };

  try {
    await promisify(test1)("foo");
  } catch (e) {
    expect(e.message).toEqual("oops");
    return;
  }
  fail("promisify did not reject");
});

test("call.callback should call callback function", async () => {
  function* test1(message) {
    return yield call.callback(test2, message);
  }

  function test2(message, done) {
    done(null, message);
  }

  const result = await promisify(test1)("foo");
  expect(result).toEqual("foo");
});

test("[error handling] call.callback should call callback function", async () => {
  function* test1(message) {
    return yield call.callback(test2, message);
  }

  function test2(message, done) {
    done(new Error("oops"), message);
  }

  try {
    await promisify(test1)("foo");
  } catch (e) {
    expect(e.message).toEqual("oops");
    return;
  }
  fail("promisify did not reject");
});

test("[error handling 2] call.callback should call callback function", async () => {
  function* test1(message) {
    return yield call.callback(test2, message);
  }

  function test2(message, done) {
    throw new Error("oops");
  }

  try {
    await promisify(test1)("foo");
  } catch (e) {
    expect(e.message).toEqual("oops");
    return;
  }
  fail("promisify did not reject");
});

test("call.callbackBound should call callback function", async () => {
  function* test1(message) {
    return yield call.callbackBound(obj, obj.test2, message);
  }

  const obj = {
    value: "bar",
    test2(message, done) {
      done(null, `${message}${this.value}`);
    }
  };

  const result = await promisify(test1)("foo");
  expect(result).toEqual("foobar");
});

test("[error handling] call.callbackBound should call callback function", async () => {
  function* test1(message) {
    return yield call.callbackBound(obj, obj.test2, message);
  }

  const obj = {
    value: "bar",
    test2(message, done) {
      done(new Error("oops"), `${message}${this.value}`);
    }
  };

  try {
    await promisify(test1)("foo");
  } catch (e) {
    expect(e.message).toEqual("oops");
    return;
  }
  fail("promisify did not reject");
});

test("[error handling] call.callbackBound should call callback function", async () => {
  function* test1(message) {
    return yield call.callbackBound(obj, obj.test2, message);
  }

  const obj = {
    value: "bar",
    test2(message, done) {
      throw new Error("oops");
    }
  };

  try {
    await promisify(test1)("foo");
  } catch (e) {
    expect(e.message).toEqual("oops");
    return;
  }
  fail("promisify did not reject");
});

test("promisify(fn).callWithContext({...}) should call function with context patch", async () => {
  setContext({ configProperty: "foo" });
  // Handler
  function testEffect(cmd, { context }) {
    return context.configProperty;
  }

  addToHandlers({ testEffect });

  function* test1(message) {
    const result = yield { type: "testEffect" };
    return `${result}${message}`;
  }

  const result1 = await promisify(test1)("bar");
  expect(result1).toEqual("foobar");

  const result2 = await promisify(test1).callWithContext(
    {
      configProperty: "bar"
    },
    "bar"
  );
  expect(result2).toEqual("barbar");
});

test("addToHandlers(), getHandlers(), setHandlers()", () => {
  reset();

  function testEffect1() {
    return "test1";
  }

  function testEffect2() {
    return "test2";
  }

  expect(getHandlers()).toEqual({});

  addToHandlers({ testEffect1 });
  expect(getHandlers()).toEqual({ testEffect1 });

  addToHandlers({ testEffect2 });
  expect(getHandlers()).toEqual({ testEffect1, testEffect2 });

  setHandlers({});
  expect(getHandlers()).toEqual({});
});

test("addToContext(), getContext(), setContext()", () => {
  reset();

  expect(getContext()).toEqual({});

  addToContext({ test1: "foo" });
  expect(getContext()).toEqual({ test1: "foo" });

  addToContext({ test2: "bar" });
  expect(getContext()).toEqual({ test1: "foo", test2: "bar" });

  setContext({});
  expect(getContext()).toEqual({});
});
