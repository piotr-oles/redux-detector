import { Detector } from './Detector';

export function combineDetectors<S, A>(detectors: Detector<S>[]): Detector<S> {
  return function combinedDetector(prevState: S, nextState: S): A[] {
    return detectors
      .map(detector => detector(prevState, nextState))
      .reduce<A[]>((actions: A[], nextActions: A[]) => actions.concat(nextActions), []);
  };
}
