import { mapNextState } from "../../src";

describe("lib/mapNextState", () => {
  const prevState = "a";
  const nextState = "b";

  it("should export mapNextState function", () => {
    expect(mapNextState).toBeInstanceOf(Function);
  });

  it("should return detector that returns nextState without selector", () => {
    const detector = mapNextState();
    expect(detector(prevState, nextState)).toEqual(nextState);
  });

  it("should return detector that returns nextState mapped by selector", () => {
    const selector = (state?: string) => state!.toUpperCase();
    const detector = mapNextState(selector);

    expect(detector(prevState, nextState)).toEqual(nextState.toUpperCase());
  });
});
