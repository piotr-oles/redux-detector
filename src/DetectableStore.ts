import { Store } from 'redux';
import { Detector } from './Detector';

export interface DetectableStore<S> extends Store<S> {
  replaceDetector(nextDetector: Detector<S>): void;
}
