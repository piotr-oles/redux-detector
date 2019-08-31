import { changedAndFalsy } from "../../src";

describe("lib/changedAndFalsy", () => {
  const empty = {};

  it("should export changedAndFalsy function", () => {
    expect(changedAndFalsy).toBeInstanceOf(Function);
  });

  it.each([
    [undefined, undefined, false],
    [false, false, false],
    [true, true, false],
    [true, false, true],
    [false, 0, true],
    [true, 1, false],
    [0, 0, false],
    [0, 1, false],
    [1, 0, true],
    ["", "", false],
    [empty, empty, false],
    [{}, {}, false],
    [empty, {}, false]
  ])(
    "should detect changes using shallow equal for %p and %p and if next state is falsy",
    (...args: any[]) => {
      const [prevState, nextState, shouldChange] = args;

      expect(changedAndFalsy(state => state)(prevState, nextState)).toEqual(
        shouldChange
      );
    }
  );
});
