// we don't use <A extends Action> because of compatibility with other redux middlewares and enhancers
export type Detector<S> = <A>(prevState: S, nextState: S) => A[] | void;
