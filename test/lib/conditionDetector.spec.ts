import { composeIf } from "../../src";

describe("conditionDetector", () => {
  it("should export conditionDetector function", () => {
    expect(composeIf).toBeInstanceOf(Function);
  });

  it("should return conditional detector", () => {
    const action = { type: "ACTION" };
    const detector = jest.fn(() => action);
    const conditionalDetector = composeIf(
      (prevState?: number, nextState?: number) =>
        !!(prevState && nextState && prevState < nextState),
      detector
    );

    expect(conditionalDetector(1, 2)).toEqual(action);
    expect(detector).toBeCalledWith(1, 2);

    expect(conditionalDetector(2, 1)).toBeUndefined();
    expect(detector).not.toBeCalledWith(2, 1);
  });
});
