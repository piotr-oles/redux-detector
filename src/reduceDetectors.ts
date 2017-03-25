import { Detector } from './Detector';
import { ActionLike } from './ActionLike';

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
  return function combinedDetector(prevState: S, nextState: S): ActionLike[] {
    return detectors
      .map(detector => detector(prevState, nextState) || [])
      .reduce<ActionLike[]>((actions: ActionLike[], nextActions: ActionLike | ActionLike[]) => actions.concat(nextActions), []);
  };
}
