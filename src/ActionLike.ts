import { Action } from 'redux';

export interface ActionLike extends Action {
  [key: string]: any;
}
