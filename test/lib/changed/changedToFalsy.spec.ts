import { changedToFalsy } from "../../../src";

describe("lib/changed/changedToFalsy", () => {
  const empty = {};

  it("should export changedToFalsy function", () => {
    expect(changedToFalsy).toBeInstanceOf(Function);
  });

  it.each([
    [undefined, undefined, false],
    [false, false, false],
    [true, true, false],
    [true, false, true],
    [0, 0, false],
    [0, 1, false],
    [1, 0, true],
    ["", "", false],
    [empty, empty, false],
    [{}, {}, false],
    [empty, {}, false]
  ])(
    "should detect changes to falsy using shallow equal for %p and %p",
    (...args: any[]) => {
      const [prevState, nextState, shouldChange] = args;

      expect(changedToFalsy(prevState, nextState)).toEqual(shouldChange);
    }
  );
});
