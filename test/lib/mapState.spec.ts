import { mapState } from "../../src";

describe("lib/mapState", () => {
  it("should export mapState function", () => {
    expect(mapState).toBeInstanceOf(Function);
  });

  it("should map state using selector", () => {
    interface State {
      branchA: {
        subBranchB: {
          value: number;
        };
      };
    }
    function detector(
      prevState?: State["branchA"]["subBranchB"],
      nextState?: State["branchA"]["subBranchB"]
    ) {
      if (
        prevState &&
        prevState.value === 1 &&
        nextState &&
        nextState.value === 5
      ) {
        return [{ type: "SELECTORS_WORKED" }];
      }
    }
    function selector(state: State | undefined) {
      return state!.branchA.subBranchB;
    }

    const mountedDetector = mapState(selector, detector);

    expect(mountedDetector).toBeInstanceOf(Function);

    const detectedActions = mountedDetector(
      {
        branchA: {
          subBranchB: {
            value: 1
          }
        }
      },
      {
        branchA: {
          subBranchB: {
            value: 5
          }
        }
      }
    );

    expect(detectedActions).toBeInstanceOf(Array);
    expect(detectedActions).toEqual([{ type: "SELECTORS_WORKED" }]);
  });
});
