import { mapNextState, mapTruthy } from "../../src";

describe("lib/mapTruthy", () => {
  it("should export mapTruthy function", () => {
    expect(mapTruthy).toBeInstanceOf(Function);
  });

  it("should create condition detector", () => {
    const increases = (prevState?: number, nextState?: number) => {
      return (
        prevState !== undefined &&
        nextState !== undefined &&
        prevState < nextState
      );
    };
    const increasesTruthy = mapTruthy(increases);

    expect(increasesTruthy(0, 1)).toEqual(true);
    expect(increasesTruthy(1, 1)).toEqual(false);
    expect(increasesTruthy(1, 0)).toEqual(false);
  });

  it("should map result to boolean value", () => {
    const nextStateIsTruthy = mapTruthy(mapNextState());

    expect(nextStateIsTruthy(undefined, "a")).toEqual(true);
    expect(nextStateIsTruthy(undefined, undefined)).toEqual(false);
    expect(nextStateIsTruthy(undefined, false)).toEqual(false);
    expect(nextStateIsTruthy(undefined, 0)).toEqual(false);
    expect(nextStateIsTruthy(undefined, {})).toEqual(true);
  });
});
