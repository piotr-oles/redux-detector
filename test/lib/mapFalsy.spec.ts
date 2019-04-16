import { mapFalsy, mapNextState } from "../../src";

describe("lib/mapFalsy", () => {
  it("should export mapFalsy function", () => {
    expect(mapFalsy).toBeInstanceOf(Function);
  });

  it("should create negative condition detector", () => {
    const increases = (prevState?: number, nextState?: number) => {
      return (
        prevState !== undefined &&
        nextState !== undefined &&
        prevState < nextState
      );
    };
    const decreasesOrEquals = mapFalsy(increases);

    expect(decreasesOrEquals(0, 1)).toEqual(false);
    expect(decreasesOrEquals(1, 1)).toEqual(true);
    expect(decreasesOrEquals(1, 0)).toEqual(true);
  });

  it("should map result to boolean negative value", () => {
    const nextStateIsFalsy = mapFalsy(mapNextState());

    expect(nextStateIsFalsy(undefined, "a")).toEqual(false);
    expect(nextStateIsFalsy(undefined, undefined)).toEqual(true);
    expect(nextStateIsFalsy(undefined, false)).toEqual(true);
    expect(nextStateIsFalsy(undefined, 0)).toEqual(true);
    expect(nextStateIsFalsy(undefined, {})).toEqual(false);
  });
});
