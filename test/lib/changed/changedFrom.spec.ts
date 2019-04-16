import { changedFrom } from "../../../src";

describe("lib/changed/changedFrom", () => {
  const empty = {};

  it("should export changedFrom function", () => {
    expect(changedFrom).toBeInstanceOf(Function);
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
    "should detect changes from using shallow equal for %p and %p",
    (...args: any[]) => {
      const [prevState, nextState, shouldChange] = args;

      expect(changedFrom(prevState)(prevState, nextState)).toEqual(
        shouldChange
      );
    }
  );
});
