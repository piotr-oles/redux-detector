import { StoreEnhancer, StoreEnhancerStoreCreator, Store, Reducer } from 'redux';
import { Detector } from './Detector';
import { StoreDetectable } from './StoreDetectable';

const ActionTypes: { INIT: string } = {
  INIT: '@@detector/INIT'
};

export type StoreDetectableEnhancer<S> = (next: StoreEnhancerStoreDetectableCreator<S>) => StoreEnhancerStoreDetectableCreator<S>;
export type StoreEnhancerStoreDetectableCreator<S> = (reducer: Reducer<S>, preloadedState: S) => StoreDetectable<S>;

export function createDetectorEnhancer<S>(detector: Detector<S>): StoreDetectableEnhancer<S> {
  return function detectorEnhancer(next: StoreEnhancerStoreCreator<S>): StoreEnhancerStoreDetectableCreator<S> {
    return function storeDetectableCreator(reducer: Reducer<S>, preloadedState: S): StoreDetectable<S> {
      // first create basic store
      const store: Store<S> = next(reducer, preloadedState);

      // then set initial values in this scope
      let prevState: S = preloadedState;
      let currentDetector: Detector<S> = detector;

      // store detectable adds `replaceDetector` method to it's interface
      const storeDetectable: StoreDetectable<S> = {
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
      storeDetectable.subscribe(function detectActions(): void {
        const nextState: S = storeDetectable.getState();

        // don't set any action type because of compatibility with many redux middlewares (for example redux-thunk)
        const detectedActions: any[] | void = currentDetector(prevState, nextState);

        // store current state as previous for next subscribe call
        prevState = nextState;

        // dispatch all actions returned from detector
        if (detectedActions && Array === detectedActions.constructor) {
          detectedActions.forEach(detectedAction => storeDetectable.dispatch(detectedAction));
        }
      });

      return storeDetectable;
    };
  };
}
