import {Action, AnyAction, Store} from 'redux';
import {DetectableStoreExt} from "./DetectableStoreExt";

/**
 * Store enhanced by detector enhancer.
 */
export type DetectableStore<S = any, A extends Action = AnyAction> = Store<S, A> & DetectableStoreExt<S>;
