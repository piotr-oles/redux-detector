
import { StoreEnhancer, Reducer, compose, createStore } from 'redux';
import { Detector } from './Detector';
import { StoreDetectable } from './StoreDetectable';
import { createDetectorEnhancer } from './createDetectorEnhancer';

export function createDetectableStore<S>(
  reducer: Reducer<S>,
  detector: Detector<S>,
  preloadedState: S,
  enhancer?: StoreEnhancer<S>
): StoreDetectable<S> {
  if (enhancer) {
    enhancer = compose(createDetectorEnhancer(detector), enhancer);
  } else {
    enhancer = createDetectorEnhancer(detector);
  }

  return createStore(reducer, preloadedState, enhancer) as StoreDetectable<S>;
}
