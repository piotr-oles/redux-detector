import { composeOr } from "../../src";

describe("composeOr", () => {
  it("should export composeOr function", () => {
    expect(composeOr).toBeInstanceOf(Function);
  });

  it("should compose falsy detector for empty arguments", () => {
    expect(composeOr()(true, true)).toEqual(false);
  });

  it("should compose detectors with OR operation", () => {
    const detector = composeOr(
      prevState => !!prevState,
      (prevState, nextState) => !!nextState
    );

    expect(detector(false, false)).toEqual(false);
    expect(detector(false, true)).toEqual(true);
    expect(detector(true, false)).toEqual(true);
    expect(detector(true, true)).toEqual(true);
  });
});
