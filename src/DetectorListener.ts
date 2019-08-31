import { Dispatch } from "redux";

/**
 * API provided to the DetectorListener
 */
export interface DetectorListenerAPI<D extends Dispatch = Dispatch, S = any> {
  dispatch: D;
  getState(): S;
}

/**
 * DetectorListener is an object that consists of two callbacks:
 *  - `next` for successful dispatched action
 *  - `error` for dispatch that throws an error
 */
export interface DetectorListener {
  next?: (result: any, action: any, api: DetectorListenerAPI) => void;
  error?: (error: any, action: any, api: DetectorListenerAPI) => void;
}
