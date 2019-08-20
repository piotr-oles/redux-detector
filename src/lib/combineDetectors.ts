import { ActionsDetector } from "../Detector";

type ActionsDetectorsMap<TState extends object, TAction = any> = {
  [K in keyof TState]?: ActionsDetector<TState[K], TAction>
};

/**
 * Combine detectors to bind them to the local state.
 * It allows to create reusable detectors.
 *
 * @param map Map of detectors bounded to state.
 * @returns Combined detector
 */
export function combineDetectors<TState extends object, TAction = any>(
  map: ActionsDetectorsMap<TState, TAction>
): ActionsDetector<TState, TAction> {
  return function combinedDetector(
    prevState?: TState,
    nextState?: TState
  ): any[] {
    return Object.keys(map).reduce((reducedActions: any[], key: string) => {
      let actions: any | any[] | void = map[key as keyof TState]!(
        prevState ? prevState[key as keyof TState] : undefined,
        nextState ? nextState[key as keyof TState] : undefined
      );

      if (actions) {
        if (actions.constructor !== Array) {
          actions = [actions];
        }

        reducedActions = reducedActions.concat(...actions);
      }

      return reducedActions;
    }, []);
  };
}
