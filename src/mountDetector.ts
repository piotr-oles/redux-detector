import { Detector } from './Detector';

export function mountDetector<S1, S2>(selector: (state: S1) => S2, detector: Detector<S2>): Detector<S1> {
  return function mountedDetector(prevState: S1, nextState: S1): any | any[] | void {
    return detector(selector(prevState), selector(nextState));
  };
}
