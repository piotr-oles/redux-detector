
import { assert } from 'chai';
import { createDetectableStore } from '../src/index';

describe('createDetectableStore', () => {

  it('should export createDetectableStore function', () => {
    assert.isFunction(createDetectableStore);
  });

  it('should create new redux store without enhancer', () => {
    function dumbReducer(state) {
      return state;
    }
    function dumbDetector() {
      return [];
    }
    const dumbState = {};
    const detectableStore = createDetectableStore(dumbReducer, dumbDetector, dumbState);

    assert.isObject(detectableStore);
    assert.isFunction(detectableStore.dispatch);
    assert.isFunction(detectableStore.subscribe);
    assert.isFunction(detectableStore.getState);
    assert.isFunction(detectableStore.replaceReducer);
    assert.isFunction(detectableStore.replaceDetector);
  });

  it('should create new redux store with enhancer', () => {
    function dumbReducer(state) {
      return state;
    }
    function dumbDetector() {
      return [];
    }
    const dumbState = {};
    const dumbEnhancer = function(next) { return next; };
    const detectableStore = createDetectableStore(dumbReducer, dumbDetector, dumbState, dumbEnhancer);

    assert.isObject(detectableStore);
    assert.isFunction(detectableStore.dispatch);
    assert.isFunction(detectableStore.subscribe);
    assert.isFunction(detectableStore.getState);
    assert.isFunction(detectableStore.replaceReducer);
    assert.isFunction(detectableStore.replaceDetector);
  });
});
