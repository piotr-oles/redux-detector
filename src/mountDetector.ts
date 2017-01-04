
import { Detector } from './Detector';

export function mountDetector<S1, S2, A>(selector: (state: S1) => S2, detector: Detector<S2>): Detector<S1> {
  return function mountedDetector(prevState: S1, nextState: S1): A[] {
    return detector<A>(selector(prevState), selector(nextState));
  };
}
