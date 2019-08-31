import { Reducer, Store, StoreEnhancer } from "redux";
import { DetectableStore } from "./DetectableStore";
import { DetectableStoreExt } from "./DetectableStoreExt";
import { ActionsDetector } from "./Detector";
import { DetectorListener, DetectorListenerAPI } from "./DetectorListener";

export const ActionTypes: { INIT: string } = {
  INIT: "@@detector/INIT"
};

export type StoreDetectableEnhancer<S> = StoreEnhancer<
  DetectableStoreExt<S>,
  {}
>;

/**
 * Creates detector enhancer that modifies redux store to use it with provided detector.
 *
 * @param detector Root actions detector
 * @param listener
 * @returns Store enhancer
 */
export function createDetectorEnhancer<S = any>(
  detector: ActionsDetector<S>,
  listener?: DetectorListener
): StoreDetectableEnhancer<S> {
  if (typeof detector !== "function") {
    throw new Error("Expected the detector to be a function.");
  }

  return function detectorEnhancer(next) {
    return function detectableStoreCreator(
      reducer: Reducer<any, any>,
      preloadedState?: any
    ): DetectableStore<any, any> {
      // first create basic store
      const store = next(reducer, preloadedState);

      // then set initial values in this scope
      let prevState = preloadedState;
      let currentDetector = detector;
      let isDispatchingFromQueue = false;
      let actionsQueue: any[] = [];

      // store detectable adds `replaceDetector` method to it's interface
      const detectableStore: DetectableStore<any, any> = {
        ...store,
        replaceDetector: function replaceDetector(
          nextDetector: ActionsDetector<any>
        ): void {
          if (typeof nextDetector !== "function") {
            throw new Error("Expected the nextDetector to be a function.");
          }

          currentDetector = nextDetector;
          store.dispatch({ type: ActionTypes.INIT });
        }
      };

      // create an API for listener
      const listenerAPI: DetectorListenerAPI<any, S> = {
        dispatch: store.dispatch,
        getState: store.getState
      };

      // have to run detector on every state change
      detectableStore.subscribe(function detectActions(): void {
        const nextState: S = detectableStore.getState();

        // detect actions by comparing prev and next state
        let detectedActions: any | any[] =
          currentDetector(prevState, nextState) || [];

        // convert to array
        detectedActions =
          Array === detectedActions.constructor
            ? detectedActions
            : [detectedActions];

        // add to the actions queue
        actionsQueue = actionsQueue.concat(detectedActions);

        // store current state as previous for next subscribe call
        prevState = nextState;

        // dispatch actions for action queue
        if (!isDispatchingFromQueue && actionsQueue.length > 0) {
          isDispatchingFromQueue = true;
          while (actionsQueue.length > 0) {
            // get next action from the queue
            const action = actionsQueue.shift();

            try {
              // dispatch next action - it can throw an error so it's wrapped into try-catch block
              const result = detectableStore.dispatch(action);

              if (result instanceof Promise) {
                // prevent UnhandledPromiseRejection error - we can handle it via listener.next but it's optional
                result.catch(() => null);
              }

              // if we have a next listener, call it with a result and the listener API
              if (listener && listener.next) {
                listener.next(result, action, listenerAPI);
              }
            } catch (error) {
              // if we have an error listener, call it with an error and the listener API
              if (listener && listener.error) {
                listener.error(error, action, listenerAPI);
              }
            }
          }
          isDispatchingFromQueue = false;
        }
      });

      return detectableStore;
    };
  };
}
