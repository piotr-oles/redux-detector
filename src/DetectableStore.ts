import { Store } from 'redux';
import { Detector } from './Detector';

/**
 * Store enhanced by detector enhancer.
 */
export interface DetectableStore<S> extends Store<S> {
  replaceDetector(nextDetector: Detector<S>): void;
}
