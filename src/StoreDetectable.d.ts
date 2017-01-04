import { Store } from 'redux';
import { Detector } from './Detector';

export interface StoreDetectable<S> extends Store<S> {
  replaceDetector(nextDetector: Detector<S>): void;
}
