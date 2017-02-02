
import { assert } from 'chai';
import { createDetectableStore } from '../src/index';

describe('createDetectableStore', function () {

  it('check if redux-detector exports createDetectableStore', function () {
    assert.isFunction(createDetectableStore);
  });

  it('check if createDetectableStore creates new redux store without enhancer', function () {
    function dumbReducer(state) {
      return state;
    }
    function dumbDetector() {
      return [];
    }
    var dumbState = {};
    var detectableStore = createDetectableStore(dumbReducer, dumbDetector, dumbState);

    assert.isObject(detectableStore);
    assert.isFunction(detectableStore.dispatch);
    assert.isFunction(detectableStore.subscribe);
    assert.isFunction(detectableStore.getState);
    assert.isFunction(detectableStore.replaceReducer);
    assert.isFunction(detectableStore.replaceDetector);
  });

  it('check if createDetectableStore creates new redux store with enhancer', function () {
    function dumbReducer(state) {
      return state;
    }
    function dumbDetector() {
      return [];
    }
    var dumbState = {};
    var dumbEnhancer = function(next) { return next; };
    var detectableStore = createDetectableStore(dumbReducer, dumbDetector, dumbState, dumbEnhancer);

    assert.isObject(detectableStore);
    assert.isFunction(detectableStore.dispatch);
    assert.isFunction(detectableStore.subscribe);
    assert.isFunction(detectableStore.getState);
    assert.isFunction(detectableStore.replaceReducer);
    assert.isFunction(detectableStore.replaceDetector);
  });
});
