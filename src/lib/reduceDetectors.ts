import { Detector } from '../Detector';

export function reduceDetectors<S>(...detectors: Detector<S>[]): Detector<S> {
  // check detectors types in runtime
  const invalidDetectorsIndexes: number[] = detectors
    .map((detector, index) => detector instanceof Function ? -1 : index)
    .filter(index => index !== -1);

  if (invalidDetectorsIndexes.length) {
    throw new Error(
      `Invalid ${invalidDetectorsIndexes.join(', ')} arguments in reduceDetectors function.\n` +
      `Detectors should be a 'function' type, ` +
      `'${invalidDetectorsIndexes.map(index => typeof detectors[index]).join(`', '`)}' types passed.`
    );
  }

  return function reducedDetector(prevState: S | undefined, nextState: S | undefined): any[] {
    return detectors
      .map(detector => detector(prevState, nextState) || [])
      .reduce((actions, nextActions) => actions.concat(nextActions), []);
  };
}
