import { composeDetectors } from "../src";

describe("composeDetectors", () => {
  it("should export composeDetectors function", () => {
    expect(composeDetectors).toBeInstanceOf(Function);
  });

  it("should return valid detector for composition of two detectors", () => {
    function detectorA() {
      return [{ type: "ACTION_A" }, { type: "ACTION_B" }];
    }

    function detectorB() {
      return [{ type: "ACTION_C" }];
    }

    const detectorAB = composeDetectors(detectorA, detectorB);

    expect(detectorAB).toBeInstanceOf(Function);
    expect(detectorAB({}, {})).toBeInstanceOf(Array);

    // we check it twice to be sure that detectorAB doesn't has any internal state.
    expect(detectorAB({}, {})).toEqual([
      { type: "ACTION_A" },
      { type: "ACTION_B" },
      { type: "ACTION_C" }
    ]);
    expect(detectorAB({}, {})).toEqual([
      { type: "ACTION_A" },
      { type: "ACTION_B" },
      { type: "ACTION_C" }
    ]);
  });

  it("should pass states in valid order for composition of two detectors", () => {
    function detectorA(prevState?: number, nextState?: number) {
      if (prevState && nextState && prevState > nextState) {
        return [{ type: "PREV_STATE_GREATER" }];
      }

      return [];
    }

    function detectorB(prevState?: number, nextState?: number) {
      if (prevState && nextState && nextState > prevState) {
        return [{ type: "NEXT_STATE_GREATER" }];
      }

      return [];
    }

    const detectorAB = composeDetectors(detectorA, detectorB);

    expect(detectorAB(-10, 50)).toEqual([{ type: "NEXT_STATE_GREATER" }]);
    expect(detectorAB(30, 20)).toEqual([{ type: "PREV_STATE_GREATER" }]);
  });

  it("should allow to compose detectors with undefined result on no-action detect", () => {
    function detectorA(prevState?: number, nextState?: number) {
      if (prevState && nextState && prevState > nextState) {
        return [{ type: "PREV_STATE_GREATER" }];
      }
    }

    function detectorB(prevState?: number, nextState?: number) {
      if (prevState && nextState && nextState > prevState) {
        return [{ type: "NEXT_STATE_GREATER" }];
      }
    }

    const detectorAB = composeDetectors(detectorA, detectorB);

    expect(detectorAB(-10, 50)).toEqual([{ type: "NEXT_STATE_GREATER" }]);
    expect(detectorAB(30, 20)).toEqual([{ type: "PREV_STATE_GREATER" }]);
  });

  it("should allow to compose detectors with array and single result", () => {
    function detectorA() {
      return [{ type: "ARRAY_DETECTOR" }];
    }

    function detectorB() {
      return { type: "SINGLE_DETECTOR" };
    }

    const detectorAB = composeDetectors(detectorA, detectorB);

    expect(detectorAB(undefined, undefined)).toEqual([
      { type: "ARRAY_DETECTOR" },
      { type: "SINGLE_DETECTOR" }
    ]);
  });

  it("should return valid composed detector for empty arguments", () => {
    const emptyDetector = composeDetectors();

    expect(emptyDetector).toBeInstanceOf(Function);
    expect(emptyDetector(10, 20)).toEqual([]);
  });

  it("should throw an exception for invalid arguments", () => {
    expect(() => {
      (composeDetectors as any)({ foo: "bar" });
    }).toThrow();
    expect(() => {
      (composeDetectors as any)(() => undefined, undefined);
    }).toThrow();
  });
});
