/**
 * Function that compares previous and next state and can return action, array of actions or undefined.
 */
export type Detector<S> = (prevState: S | undefined, nextState: S | undefined) => any | any[] | void;
