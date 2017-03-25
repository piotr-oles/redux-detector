import { ActionLike } from './ActionLike';

// we use ActionLike instead of <A extends Action>, because second form doesn't check type on definition, only on call expression.
// we could use also Detector<S, A>, but it's not practical - all we need to know is that ActionLike object has 'type': string field.
export type Detector<S> = (prevState: S | undefined, nextState: S) => ActionLike | ActionLike[] | void;
