import { changedToTruthy } from "../../src";

describe("lib/changedAndTruthy", () => {
  const empty = {};

  it("should export changedToTruthy function", () => {
    expect(changedToTruthy).toBeInstanceOf(Function);
  });

  it.each([
    [undefined, undefined, false],
    [false, false, false],
    [true, true, false],
    [true, false, false],
    [false, 0, false],
    [true, 1, false],
    [0, 0, false],
    [0, 1, true],
    [1, 0, false],
    ["", "", false],
    [empty, empty, false],
    [{}, {}, false],
    [empty, {}, false]
  ])(
    "should detect changes using shallow equal for %p and %p and if next state is truthy and previous state is falsy",
    (...args: any[]) => {
      const [prevState, nextState, shouldChange] = args;

      expect(changedToTruthy(state => state)(prevState, nextState)).toEqual(
        shouldChange
      );
    }
  );
});
