import { mapPrevState } from "../src";

describe("mapPrevState", () => {
  const prevState = "a";
  const nextState = "b";

  it("should export mapPrevState function", () => {
    expect(mapPrevState).toBeInstanceOf(Function);
  });

  it("should return detector that returns result mapped by state selector and result selector", () => {
    const stateSelector = (state?: string) => state!.toUpperCase();
    const resultSelector = (state?: string) => `result: ${state}`;
    const detector = mapPrevState(stateSelector, resultSelector);

    expect(detector(prevState, nextState)).toEqual(
      `result: ${prevState.toUpperCase()}`
    );
  });
});
