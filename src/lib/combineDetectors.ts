import { Detector } from "../Detector";
import { DetectorsMap } from "../DetectorsMap";

/**
 * Combine detectors to bind them to the local state.
 * It allows to create reusable detectors.
 *
 * @param map Map of detectors bounded to state.
 * @returns Combined detector
 */
export function combineDetectors<S extends object>(
  map: DetectorsMap<S>
): Detector<S> {
  return function combinedDetector(
    prevState: S | undefined,
    nextState: S | undefined
  ): any[] {
    return Object.keys(map).reduce((reducedActions: any[], key: string) => {
      let actions: any | any[] | void = map[key as keyof S]!(
        prevState ? prevState[key as keyof S] : undefined,
        nextState ? nextState[key as keyof S] : undefined
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
