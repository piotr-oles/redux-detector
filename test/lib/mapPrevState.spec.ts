import { mapPrevState } from "../../src";

describe("lib/mapPrevState", () => {
  const prevState = "a";
  const nextState = "b";

  it("should export mapPrevState function", () => {
    expect(mapPrevState).toBeInstanceOf(Function);
  });

  it("should return detector that returns prevState without selector", () => {
    const detector = mapPrevState();
    expect(detector(prevState, nextState)).toEqual(prevState);
  });

  it("should return detector that returns prevState mapped by selector", () => {
    const selector = (state?: string) => state!.toUpperCase();
    const detector = mapPrevState(selector);

    expect(detector(prevState, nextState)).toEqual(prevState.toUpperCase());
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
