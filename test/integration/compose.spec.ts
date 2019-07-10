import {
  changedAndTruthy,
  composeAnd,
  composeIf,
  composeOr,
  isTruthy,
  mapNextState
} from "../../src";

describe("detectors compose", () => {
  interface State {
    a: number;
  }
  const getA = (state: State | undefined) => (state ? state.a : 0);
  const isANotNegative = (state: State | undefined) =>
    state && getA(state) >= 0;
  const isAZero = (state: State | undefined) => state && getA(state) === 0;
  const isAPositive = (state: State | undefined) => state && getA(state) > 0;
  const action = (payload: any) => ({ type: "DETECTED", payload });

  const detector = composeIf<State>(
    composeAnd(
      isTruthy(isANotNegative),
      composeOr(changedAndTruthy(isAZero), isTruthy(isAPositive))
    ),
    mapNextState(getA, (a?: number) => action(a))
  );

  it.each([
    [undefined, undefined, false],
    [undefined, -1, false],
    [undefined, 0, true],
    [undefined, 1, true],
    [-1, undefined, false],
    [-1, -1, false],
    [-1, 0, true],
    [-1, 1, true],
    [0, undefined, false],
    [0, -1, false],
    [0, 0, false],
    [0, 1, true],
    [1, undefined, false],
    [1, -1, false],
    [1, 0, true],
    [1, 1, true]
  ])(
    "should compose detectors for prevA = %p, nextA = %p and should detect = %p",
    (...args: any[]) => {
      const [prevA, nextA, shouldDetect] = args;

      const prevState = prevA !== undefined ? { a: prevA } : undefined;
      const nextState = nextA !== undefined ? { a: nextA } : undefined;

      expect(detector(prevState, nextState)).toEqual(
        shouldDetect ? action(nextA) : undefined
      );
    }
  );
});
