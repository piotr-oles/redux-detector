import { Action } from 'redux';

export type Detector<S> = <A extends Action>(prevState: S | undefined, nextState: S) => A[] | void;
