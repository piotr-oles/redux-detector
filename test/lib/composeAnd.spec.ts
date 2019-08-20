import { composeAnd } from "../../src";

describe("composeAnd", () => {
  it("should export composeAnd function", () => {
    expect(composeAnd).toBeInstanceOf(Function);
  });

  it("should compose falsy detector for empty arguments", () => {
    expect(composeAnd()(true, true)).toEqual(false);
  });

  it("should compose detectors with AND operation", () => {
    const detector = composeAnd(
      prevState => !!prevState,
      (prevState, nextState) => !!nextState
    );

    expect(detector(false, false)).toEqual(false);
    expect(detector(false, true)).toEqual(false);
    expect(detector(true, false)).toEqual(false);
    expect(detector(true, true)).toEqual(true);
  });
});
