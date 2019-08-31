import { changedAndTruthy } from "../../src";

describe("lib/changedAndTruthy", () => {
  const empty = {};

  it("should export changedAndTruthy function", () => {
    expect(changedAndTruthy).toBeInstanceOf(Function);
  });

  it.each([
    [undefined, undefined, false],
    [false, false, false],
    [true, true, false],
    [true, false, false],
    [false, 0, false],
    [true, 1, true],
    [0, 0, false],
    [0, 1, true],
    [1, 0, false],
    ["", "", false],
    [empty, empty, false],
    [{}, {}, true],
    [empty, {}, true]
  ])(
    "should detect changes using shallow equal for %p and %p and if next state is truthy",
    (...args: any[]) => {
      const [prevState, nextState, shouldChange] = args;

      expect(changedAndTruthy(state => state)(prevState, nextState)).toEqual(
        shouldChange
      );
    }
  );
});
