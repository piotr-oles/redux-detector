import { changed } from "../../src";

describe("lib/changed/changed", () => {
  const empty = {};

  it("should export changed function", () => {
    expect(changed).toBeInstanceOf(Function);
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
    "should detect changes using shallow equal for %p and %p",
    (...args: any[]) => {
      const [prevState, nextState, shouldChange] = args;

      expect(changed(state => state)(prevState, nextState)).toEqual(
        shouldChange
      );
    }
  );
});
