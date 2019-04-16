import { changedFromFalsy } from "../../../src";

describe("lib/changed/changedFromFalsy", () => {
  const empty = {};

  it("should export changedFromFalsy function", () => {
    expect(changedFromFalsy).toBeInstanceOf(Function);
  });

  it.each([
    [undefined, undefined, false],
    [false, false, false],
    [true, true, false],
    [true, false, false],
    [0, 0, false],
    [0, 1, true],
    [1, 0, false],
    ["", "", false],
    [empty, empty, false],
    [{}, {}, false],
    [empty, {}, false]
  ])(
    "should detect changes from falsy using shallow equal for %p and %p",
    (...args: any[]) => {
      const [prevState, nextState, shouldChange] = args;

      expect(changedFromFalsy(prevState, nextState)).toEqual(shouldChange);
    }
  );
});
