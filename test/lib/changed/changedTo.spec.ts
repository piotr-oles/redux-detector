import { changedTo } from "../../../src";

describe("lib/changed/changedTo", () => {
  const empty = {};

  it("should export changedTo function", () => {
    expect(changedTo).toBeInstanceOf(Function);
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
    "should detect changes to using shallow equal for %p and %p",
    (...args: any[]) => {
      const [prevState, nextState, shouldChange] = args;

      expect(changedTo(nextState)(prevState, nextState)).toEqual(shouldChange);
    }
  );
});
