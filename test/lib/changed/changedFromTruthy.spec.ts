import { changedFromTruthy } from "../../../src";

describe("lib/changed/changedFromTruthy", () => {
  const empty = {};

  it("should export changedFromTruthy function", () => {
    expect(changedFromTruthy).toBeInstanceOf(Function);
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
    [{}, {}, true],
    [empty, {}, true]
  ])(
    "should detect changes from truthy using shallow equal for %p and %p",
    (...args: any[]) => {
      const [prevState, nextState, shouldChange] = args;

      expect(changedFromTruthy(prevState, nextState)).toEqual(shouldChange);
    }
  );
});
