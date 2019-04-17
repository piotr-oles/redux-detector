import { isEqual } from "../../src";

describe("lib/isEqual", () => {
  const empty = {};

  it("should export isEqual function", () => {
    expect(isEqual).toBeInstanceOf(Function);
  });

  it.each([
    [undefined, undefined, false],
    [false, false, false],
    [true, true, false],
    [true, false, true],
    [0, 0, false],
    [0, 1, true],
    ["", "", false],
    [empty, empty, false],
    [{}, {}, true],
    [empty, {}, true]
  ])(
    "should check if for prev state %p, next state is equal %p",
    (...args: any[]) => {
      const [prevState, nextState, shouldChange] = args;

      expect(isEqual(state => state, nextState)(prevState, nextState)).toEqual(
        true
      );
      expect(isEqual(state => state, prevState)(prevState, nextState)).toEqual(
        !shouldChange
      );
    }
  );
});
