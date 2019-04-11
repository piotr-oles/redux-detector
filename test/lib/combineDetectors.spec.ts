import { combineDetectors } from "../../src";

describe("lib/combineDetectors", () => {
  it("should export reduceDetectors function", () => {
    expect(combineDetectors).toBeInstanceOf(Function);
  });

  it("should create detector function", () => {
    expect(combineDetectors({})).toBeInstanceOf(Function);
  });

  it.each([[{}, {}], [undefined, {}], [{}, undefined], [undefined, undefined]])(
    "should return valid detector for empty map when states are [%p, %p]",
    (prevState: any, nextState: any) => {
      const detector = combineDetectors({});

      expect(detector(prevState, nextState)).toEqual([]);
    }
  );

  it("should return detector that binds detectors to local state", () => {
    const aDetector = jest.fn();
    const bDetector = jest.fn();
    const detector = combineDetectors({
      a: aDetector,
      b: bDetector
    });

    const prevState = {
      a: "foo",
      b: "bar"
    };
    const nextState = {
      a: 123,
      b: 321
    };

    expect(detector).toBeInstanceOf(Function);
    expect(detector(prevState, nextState)).toEqual([]);
    expect(aDetector).toHaveBeenCalledWith("foo", 123);
    expect(bDetector).toHaveBeenCalledWith("bar", 321);
  });

  it.each([
    [{}, {}, []],
    [undefined, {}, []],
    [{}, undefined, []],
    [undefined, undefined, []],
    [
      {
        a: "a",
        b: "a"
      },
      {
        a: "b",
        b: "b",
        c: "c"
      },
      [{ type: "A_TO_B_TRANSITION" }, { type: "FROM_A_OR_B_TRANSITION" }]
    ],
    [
      {
        a: "b",
        b: "b",
        c: "a"
      },
      {
        a: "c",
        b: "d",
        c: "b"
      },
      [{ type: "FROM_A_OR_B_TRANSITION" }]
    ]
  ])(
    "should merge actions returned by combined detectors for [%p, %p] and return %p",
    (...args: any[]) => {
      const [prevState, nextState, actions] = args;

      function detectorA(prevString?: string, nextString?: string) {
        if (prevString === "a" && nextString === "b") {
          return [{ type: "A_TO_B_TRANSITION" }];
        }
      }
      function detectorB(prevString?: string, nextString?: string) {
        if (
          prevString !== nextString &&
          (prevString === "a" || prevString === "b")
        ) {
          return { type: "FROM_A_OR_B_TRANSITION" };
        }
      }
      function detectorC() {
        return undefined;
      }

      const detector = combineDetectors({
        a: detectorA,
        b: detectorB,
        c: detectorC
      });

      expect(detector(prevState, nextState)).toEqual(actions);
    }
  );
});
