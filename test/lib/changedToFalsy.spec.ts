import { changedToFalsy } from "../../src";

describe("lib/changedAndFalsy", () => {
  const empty = {};

  it("should export changedToFalsy function", () => {
    expect(changedToFalsy).toBeInstanceOf(Function);
  });

  it.each([
    [undefined, undefined, false],
    [false, false, false],
    [true, true, false],
    [true, false, true],
    [false, 0, false],
    [true, 1, false],
    [0, 0, false],
    [0, 1, false],
    [1, 0, true],
    ["", "", false],
    [empty, empty, false],
    [{}, {}, false],
    [empty, {}, false]
  ])(
    "should detect changes using shallow equal for %p and %p and if next state is falsy and previous state is truthy",
    (...args: any[]) => {
      const [prevState, nextState, shouldChange] = args;

      expect(changedToFalsy(state => state)(prevState, nextState)).toEqual(
        shouldChange
      );
    }
  );
});
