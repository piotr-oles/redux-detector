import { wasEqual } from "../../src";

describe("lib/wasEqual", () => {
  const empty = {};

  it("should export wasEqual function", () => {
    expect(wasEqual).toBeInstanceOf(Function);
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
  ])("should check if prev state was equal %p", (...args: any[]) => {
    const [prevState, nextState, shouldChange] = args;

    expect(wasEqual(state => state, prevState)(prevState, nextState)).toEqual(
      true
    );
    expect(wasEqual(state => state, nextState)(prevState, nextState)).toEqual(
      !shouldChange
    );
  });
});
