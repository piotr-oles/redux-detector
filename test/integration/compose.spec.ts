import {
  changedFromFalsy,
  changedToTruthy,
  composeAnd,
  composeOr,
  conditionDetector,
  mapNextState,
  mapState
} from "../../src";

describe("detectors compose", () => {
  interface State {
    a: number;
  }
  const getA = (state: State | undefined) => (state ? state.a : 0);
  const isAPositive = (state: State | undefined) => getA(state) > 0;
  const isAZero = (state: State | undefined) => getA(state) === 0;
  const action = (payload: any) => ({ type: "DETECTED", payload });

  const detector = conditionDetector<State>(
    composeAnd(
      mapNextState(isAPositive),
      composeOr(
        mapState(isAZero, changedToTruthy),
        mapState(isAPositive, changedFromFalsy)
      )
    ),
    mapNextState(getA, (a?: number) => action(a))
  );

  it.each([
    [undefined, undefined, false],
    [undefined, -1, false],
    [undefined, 0, false],
    [undefined, 1, true],
    [-1, undefined, false],
    [-1, -1, false],
    [-1, 0, false],
    [-1, 1, true],
    [0, undefined, false],
    [0, -1, false],
    [0, 0, false],
    [0, 1, true],
    [1, undefined, false],
    [1, -1, false],
    [1, 0, false],
    [1, 1, false]
  ])(
    "should compose detectors for prevA = %p, nextA = %p and should detect = %p",
    (...args: any[]) => {
      const [prevA, nextA, shouldDetect] = args;

      const prevState = prevA ? { a: prevA } : undefined;
      const nextState = nextA ? { a: nextA } : undefined;

      expect(detector(prevState, nextState)).toEqual(
        shouldDetect ? action(nextA) : undefined
      );
    }
  );
});
