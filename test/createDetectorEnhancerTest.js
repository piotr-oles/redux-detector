
var chai = require('chai');
var spies = require('chai-spies');
var createDetectorEnhancer = require('../lib/index').createDetectorEnhancer;

chai.use(spies);

var assert = chai.assert;
var expect = chai.expect;

describe('createDetectableStore', function () {

  it('check if redux-detector exports createDetectorEnhancer', function () {
    assert.isFunction(createDetectorEnhancer);
  });

  it('check if createDetectorEnhancer creates new enhancer', function () {
    function dumbReducer(state) {
      return state;
    }
    function dumbDetector() {
      return [];
    }
    var dumbState = {};
    function createStore() {
      return {
        dispatch: function() {},
        subscribe: function() {},
        getState: function() {},
        replaceReducer: function() {}
      };
    }
    var createStoreSpy = chai.spy(createStore);

    var detectorEnhancer = createDetectorEnhancer(dumbDetector);

    assert.isFunction(detectorEnhancer);

    var createDetectableStore = detectorEnhancer(createStoreSpy);

    expect(createStoreSpy).to.not.have.been.called;
    assert.isFunction(createDetectableStore);

    var detectableStore = createDetectableStore(dumbReducer, dumbDetector, dumbState);

    expect(createStoreSpy).to.have.been.called.once;
    assert.isObject(detectableStore);
    assert.isFunction(detectableStore.dispatch);
    assert.isFunction(detectableStore.subscribe);
    assert.isFunction(detectableStore.getState);
    assert.isFunction(detectableStore.replaceReducer);
    assert.isFunction(detectableStore.replaceDetector);
  });
});