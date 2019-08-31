import { isFalsy } from "../../src";

describe("lib/isFalsy", () => {
  const empty = {};

  it("should export isFalsy function", () => {
    expect(isFalsy).toBeInstanceOf(Function);
  });

  it.each([
    [undefined, undefined, true],
    [false, false, true],
    [true, true, false],
    [true, false, true],
    [0, 0, true],
    [0, 1, false],
    ["", "", true],
    [empty, empty, false],
    [{}, {}, false],
    [empty, {}, false]
  ])(
    "should check if for prev state %p, next state is %p is falsy = %p",
    (...args: any[]) => {
      const [prevState, nextState, shouldBeFalsy] = args;

      expect(isFalsy(state => state)(prevState, nextState)).toEqual(
        shouldBeFalsy
      );
    }
  );
});
