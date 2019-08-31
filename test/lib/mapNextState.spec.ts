import { mapNextState } from "../../src";

describe("lib/mapNextState", () => {
  const prevState = "a";
  const nextState = "b";

  it("should export mapNextState function", () => {
    expect(mapNextState).toBeInstanceOf(Function);
  });

  it("should return detector that returns mapped previous state", () => {
    const selector = (state?: string) => state!.toUpperCase();
    const detector = mapNextState(selector);

    expect(detector(prevState, nextState)).toEqual(nextState.toUpperCase());
  });

  it("should return detector that return mapped previous state by two selectors", () => {
    const selectorA = (state?: string) => state!.toUpperCase();
    const selectorB = (state?: string) => `result: ${state}`;
    const detector = mapNextState(selectorA, selectorB);

    expect(detector(prevState, nextState)).toEqual(
      `result: ${nextState.toUpperCase()}`
    );
  });

  it("should return detector that return mapped previous state by three selectors", () => {
    const selectorA = (state?: string) => state!.toUpperCase();
    const selectorB = (state?: string) => `result: ${state}`;
    const selectorC = (state?: string) => (state ? state.length : 0);
    const detector = mapNextState(selectorA, selectorB, selectorC);

    expect(detector(prevState, nextState)).toEqual(
      `result: ${nextState.toUpperCase()}`.length
    );
  });
});
