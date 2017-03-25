import { Detector } from './Detector';
import { ActionLike } from './ActionLike';
import { DetectorsMap } from './DetectorsMap';

/**
 * Combine detectors to bind them to the local state.
 * It allows to create reusable detectors.
 *
 * @param map Map of detectors bounded to state.
 * @returns Combined detector
 */
export function combineDetectors<S>(map: DetectorsMap<S>): Detector<S> {
  return function combinedDetector(prevState: S | undefined, nextState: S): ActionLike[] {
    return Object.keys(map).reduce(
      (reducedActions: ActionLike[], key: keyof S) => {
        let actions: ActionLike | ActionLike[] | void = map[key]!(
          prevState ? prevState[key] : undefined,
          nextState[key]
        );

        if (actions) {
          if (actions.constructor !== Array) {
            actions = [actions as ActionLike];
          }

          reducedActions = reducedActions.concat(...(actions as ActionLike[]));
        }

        return reducedActions;
      },
      []
    );
  };
}
