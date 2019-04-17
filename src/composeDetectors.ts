import { ActionsDetector } from "./Detector";

/**
 * Compose many action detectors into one detector that aggregates actions returned by given detectors
 */
export function composeDetectors<TState = any>(
  ...detectors: ActionsDetector<TState, any>[]
): ActionsDetector<TState, any> {
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
    prevState?: TState,
    nextState?: TState
  ): any[] {
    return detectors
      .map(detector => detector(prevState, nextState) || [])
      .reduce((actions: any[], nextActions) => actions.concat(nextActions), []);
  };
}
