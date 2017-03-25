import { Action } from 'redux';

/**
 * Interface that requires `type: string` field and is open for every extension.
 */
export interface ActionLike extends Action {
  [key: string]: any;
}
