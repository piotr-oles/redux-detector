import { Action, AnyAction } from "redux";
import { ActionsDetector } from "../Detector";

/**
 * Compose many action detectors into one detector that aggregates actions returned by given detectors
 */
export function composeDetectors<TState, TAction extends Action = AnyAction>(
  ...detectors: ActionsDetector<TState, TAction>[]
): ActionsDetector<TState, TAction> {
  // check detectors types in runtime
  const invalidDetectorsIndexes: number[] = detectors
    .map((detector, index) => (detector instanceof Function ? -1 : index))
    .filter(index => index !== -1);

  if (invalidDetectorsIndexes.length) {
    throw new Error(
      `Invalid ${invalidDetectorsIndexes.join(
        ", "
      )} arguments in composeDetectors function.\n` +
        `Detectors should be a 'function' type, ` +
        `'${invalidDetectorsIndexes
          .map(index => typeof detectors[index])
          .join(`', '`)}' types passed.`
    );
  }

  return function composedDetector(
    prevState: TState | undefined,
    nextState: TState | undefined
  ): any[] {
    return detectors
      .map(detector => detector(prevState, nextState) || [])
      .reduce(
        (actions: TAction[], nextActions) => actions.concat(nextActions),
        []
      );
  };
}
