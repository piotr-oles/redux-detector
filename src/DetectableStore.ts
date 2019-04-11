import { Action, AnyAction, Store } from "redux";
import { DetectableStoreExt } from "./DetectableStoreExt";

/**
 * Store enhanced by detector enhancer.
 */
export interface DetectableStore<S = any, A extends Action = AnyAction>
  extends Store<S, A>,
    DetectableStoreExt<S> {}
