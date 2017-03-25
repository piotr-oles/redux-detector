import { Detector } from './Detector';

export function reduceDetectors<S, A>(...detectors: Detector<S>[]): Detector<S> {
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

  return function reducedDetector(prevState: S, nextState: S): A[] {
    return detectors
      .map(detector => detector(prevState, nextState) || [])
      .reduce<A[]>((actions: A[], nextActions: A[]) => actions.concat(nextActions), []);
  };
}
