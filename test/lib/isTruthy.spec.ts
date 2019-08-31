import { isTruthy } from "../../src";

describe("lib/isTruthy", () => {
  const empty = {};

  it("should export isTruthy function", () => {
    expect(isTruthy).toBeInstanceOf(Function);
  });

  it.each([
    [undefined, undefined, false],
    [false, false, false],
    [true, true, true],
    [true, false, false],
    [0, 0, false],
    [0, 1, true],
    ["", "", false],
    [empty, empty, true],
    [{}, {}, true],
    [empty, {}, true]
  ])(
    "should check if for prev state %p, next state is %p is truthy = %p",
    (...args: any[]) => {
      const [prevState, nextState, shouldBeTruthy] = args;

      expect(isTruthy(state => state)(prevState, nextState)).toEqual(
        shouldBeTruthy
      );
    }
  );
});
