import { Detector } from './Detector';
import { ActionLike } from './ActionLike';

export function mountDetector<S1, S2>(selector: (state: S1) => S2, detector: Detector<S2>): Detector<S1> {
  return function mountedDetector(prevState: S1, nextState: S1): ActionLike | ActionLike[] | void {
    return detector(selector(prevState), selector(nextState));
  };
}
