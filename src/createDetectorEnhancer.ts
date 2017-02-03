import { StoreEnhancerStoreCreator, Store, Reducer, Action } from 'redux';
import { Detector } from './Detector';
import { DetectableStore } from './DetectableStore';

const ActionTypes: { INIT: string } = {
  INIT: '@@detector/INIT'
};

export type StoreDetectableEnhancer<S> = (next: StoreEnhancerStoreCreator<S>) => StoreEnhancerStoreDetectableCreator<S>;
export type StoreEnhancerStoreDetectableCreator<S> = (reducer: Reducer<S>, preloadedState: S) => DetectableStore<S>;

export function createDetectorEnhancer<S>(detector: Detector<S>): StoreDetectableEnhancer<S> {
  return function detectorEnhancer(next: StoreEnhancerStoreCreator<S>): StoreEnhancerStoreDetectableCreator<S> {
    return function detectableStoreCreator(reducer: Reducer<S>, preloadedState: S): DetectableStore<S> {
      // first create basic store
      const store: Store<S> = next(reducer, preloadedState);

      // then set initial values in this scope
      let prevState: S = preloadedState;
      let currentDetector: Detector<S> = detector;

      // store detectable adds `replaceDetector` method to it's interface
      const detectableStore: DetectableStore<S> = {
        ...store as any, // some bug in typescript object spread operator?
        replaceDetector: function replaceDetector(nextDetector: Detector<S>): void {
          if (typeof nextDetector !== 'function') {
            throw new Error('Expected the nextDetector to be a function.');
          }

          currentDetector = nextDetector;
          store.dispatch({ type: ActionTypes.INIT });
        }
      };

      // have to run detector on every state change
      detectableStore.subscribe(function detectActions(): void {
        const nextState: S = detectableStore.getState();

        // detect actions by comparing prev and next state
        const detectedActions: Action[] | void = currentDetector(prevState, nextState);

        // store current state as previous for next subscribe call
        prevState = nextState;

        // dispatch all actions returned from detector
        if (detectedActions && Array === detectedActions.constructor) {
          detectedActions.forEach(detectedAction => detectableStore.dispatch(detectedAction));
        }
      });

      return detectableStore;
    };
  };
}
