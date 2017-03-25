import { StoreEnhancer, Reducer, compose, createStore } from 'redux';
import { Detector } from './Detector';
import { DetectableStore } from './DetectableStore';
import { createDetectorEnhancer } from './createDetectorEnhancer';

export function createDetectableStore<S>(
  reducer: Reducer<S>,
  detector: Detector<S>,
  preloadedState?: S,
  enhancer?: StoreEnhancer<S>
): DetectableStore<S> {
  if (enhancer) {
    enhancer = compose(createDetectorEnhancer(detector), enhancer);
  } else {
    enhancer = createDetectorEnhancer(detector);
  }

  return createStore(reducer, preloadedState, enhancer) as DetectableStore<S>;
}
