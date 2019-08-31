import { mapPrevState } from "../../src";

describe("lib/mapPrevState", () => {
  const prevState = "a";
  const nextState = "b";

  it("should export mapPrevState function", () => {
    expect(mapPrevState).toBeInstanceOf(Function);
  });

  it("should return detector that returns mapped previous state", () => {
    const selector = (state?: string) => state!.toUpperCase();
    const detector = mapPrevState(selector);

    expect(detector(prevState, nextState)).toEqual(prevState.toUpperCase());
  });

  it("should return detector that return mapped previous state by two selectors", () => {
    const selectorA = (state?: string) => state!.toUpperCase();
    const selectorB = (state?: string) => `result: ${state}`;
    const detector = mapPrevState(selectorA, selectorB);

    expect(detector(prevState, nextState)).toEqual(
      `result: ${prevState.toUpperCase()}`
    );
  });

  it("should return detector that return mapped previous state by three selectors", () => {
    const selectorA = (state?: string) => state!.toUpperCase();
    const selectorB = (state?: string) => `result: ${state}`;
    const selectorC = (state?: string) => (state ? state.length : 0);
    const detector = mapPrevState(selectorA, selectorB, selectorC);

    expect(detector(prevState, nextState)).toEqual(
      `result: ${prevState.toUpperCase()}`.length
    );
  });
});
