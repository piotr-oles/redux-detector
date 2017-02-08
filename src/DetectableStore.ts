import { Store, Action } from 'redux';
import { Detector } from './Detector';

export interface DetectableStore<S> extends Store<S> {
  replaceDetector<A extends Action>(nextDetector: Detector<S>): void;
}
