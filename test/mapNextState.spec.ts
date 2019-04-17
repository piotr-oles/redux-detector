import { mapNextState } from "../src";

describe("mapNextState", () => {
  const prevState = "a";
  const nextState = "b";

  it("should export mapNextState function", () => {
    expect(mapNextState).toBeInstanceOf(Function);
  });

  it("should return detector that returns result mapped by state selector and result selector", () => {
    const stateSelector = (state?: string) => state!.toUpperCase();
    const resultSelector = (state?: string) => `result: ${state}`;
    const detector = mapNextState(stateSelector, resultSelector);

    expect(detector(prevState, nextState)).toEqual(
      `result: ${nextState.toUpperCase()}`
    );
  });
});
