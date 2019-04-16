import { changedToTruthy } from "../../../src";

describe("lib/changed/changedToTruthy", () => {
  const empty = {};

  it("should export changedToTruthy function", () => {
    expect(changedToTruthy).toBeInstanceOf(Function);
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
    [{}, {}, true],
    [empty, {}, true]
  ])(
    "should detect changes to truthy using shallow equal for %p and %p",
    (...args: any[]) => {
      const [prevState, nextState, shouldChange] = args;

      expect(changedToTruthy(prevState, nextState)).toEqual(shouldChange);
    }
  );
});
