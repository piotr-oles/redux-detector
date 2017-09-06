import { StoreEnhancerStoreCreator, Store, Reducer } from 'redux';
import { Detector } from './Detector';
import { DetectableStore } from './DetectableStore';

export const ActionTypes: { INIT: string } = {
  INIT: '@@detector/INIT'
};

export type StoreDetectableEnhancer<S> = (next: StoreEnhancerStoreCreator<S>) => StoreEnhancerStoreDetectableCreator<S>;
export type StoreEnhancerStoreDetectableCreator<S> = (reducer: Reducer<S>, preloadedState: S) => DetectableStore<S>;

/**
 * Creates detector enhancer that modifies redux store to use it with provided detector.
 *
 * @param detector Root detector
 * @returns Store enhancer
 */
export function createDetectorEnhancer<S>(detector: Detector<S>): StoreDetectableEnhancer<S> {
  if (typeof detector !== 'function') {
    throw new Error('Expected the detector to be a function.');
  }

  return function detectorEnhancer(next: StoreEnhancerStoreCreator<S>): StoreEnhancerStoreDetectableCreator<S> {
    return function detectableStoreCreator(reducer: Reducer<S>, preloadedState?: S): DetectableStore<S> {
      // first create basic store
      const store: Store<S> = next(reducer, preloadedState);

      // then set initial values in this scope
      let prevState: S | undefined = preloadedState;
      let currentDetector: Detector<S> = detector;
      let isDispatchingFromQueue: boolean = false;
      let actionsQueue: any[] = [];

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
        let detectedActions: any | any[] = currentDetector(prevState, nextState) || [];

        // convert to array
        detectedActions = (Array === detectedActions.constructor) ? detectedActions : [detectedActions];

        // add to the actions queue
        actionsQueue = actionsQueue.concat(detectedActions);

        // store current state as previous for next subscribe call
        prevState = nextState;

        // dispatch actions for action queue
        if (isDispatchingFromQueue === false && actionsQueue.length > 0) {
          isDispatchingFromQueue = true;
          while (actionsQueue.length > 0) {
            detectableStore.dispatch(actionsQueue.shift());
          }
          isDispatchingFromQueue = false;
        }
      });

      return detectableStore;
    };
  };
}
