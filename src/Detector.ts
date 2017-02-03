import { Action } from 'redux';

export type Detector<S> = <A extends Action>(prevState: S, nextState: S) => A[] | void;
