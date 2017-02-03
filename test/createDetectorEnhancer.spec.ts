
import * as chai from 'chai';
import * as spies from 'chai-spies';
import { assert, expect } from 'chai';
import { createDetectorEnhancer } from '../src/index';

chai.use(spies);

describe('createDetectableStore', () => {

  it('should export createDetectorEnhancer function', () => {
    assert.isFunction(createDetectorEnhancer);
  });

  it('should create enhancer that creates store with StoreDetectable interface', () => {
    function dumbReducer(state) {
      return state;
    }
    function dumbDetector() {
      return [];
    }
    const dumbState = {};
    function createStore() {
      return {
        dispatch: () => {},
        subscribe: chai.spy(),
        getState: () => dumbState,
        replaceReducer: () => {}
      };
    }
    const createStoreSpy = chai.spy(createStore);
    const detectorEnhancer = createDetectorEnhancer(dumbDetector);

    assert.isFunction(detectorEnhancer);

    const createDetectableStore = detectorEnhancer(createStoreSpy);

    expect(createStoreSpy).to.not.have.been.called;
    assert.isFunction(createDetectableStore);

    const detectableStore = createDetectableStore(dumbReducer, dumbState);

    expect(createStoreSpy).to.have.been.called.once;
    assert.isObject(detectableStore);
    assert.isFunction(detectableStore.dispatch);
    assert.isFunction(detectableStore.subscribe);
    assert.isFunction(detectableStore.getState);
    assert.isFunction(detectableStore.replaceReducer);
    assert.isFunction(detectableStore.replaceDetector);
    expect(detectableStore.subscribe).to.have.been.called.once;
  });

  it('should create enhancer that creates store with valid replaceDetector function', () => {
    function dumbReducer(state) {
      return state;
    }
    function dumbDetector() {
      return [];
    }
    function nextDetector() {
      return [{ type: 'NEXT_DETECTOR_REPLACED' }];
    }
    const states = [0];
    const subscribed = [];
    function createStore() {
      return {
        dispatch: chai.spy(),
        subscribe: (listener) => {
          subscribed.push(listener);
          return () => {}
        },
        getState: () => {
          // return next number on every call
          states.push(states.length);
          return states.length - 1;
        },
        replaceReducer: chai.spy()
      };
    }
    const nextDetectorSpy = chai.spy(nextDetector);
    const detectorEnhancer = createDetectorEnhancer(dumbDetector);
    const createDetectableStore = detectorEnhancer(createStore);
    const detectableStore = createDetectableStore(dumbReducer, states[0]);
    assert.lengthOf(subscribed, 1);

    assert.throws(() => { (detectableStore.replaceDetector as any)('invalid type'); }, Error);

    expect(detectableStore.dispatch).to.not.have.been.called;

    detectableStore.replaceDetector(nextDetectorSpy);
    expect(detectableStore.dispatch).to.have.been.called.once.with({ type: '@@detector/INIT' });

    // run `detectActions` method
    subscribed[0]();

    expect(nextDetectorSpy).to.have.been.called.once.with(0, 1);
    expect(detectableStore.dispatch).to.have.been.called.with({ type: 'NEXT_DETECTOR_REPLACED' });
  });

  it('should create store that runs detector on every subscribe', () => {
    function dumbReducer(state) {
      return state;
    }
    function dumbDetector() {
      return [];
    }
    const states = [0];
    const subscribed = [];
    function createStore() {
      return {
        dispatch: chai.spy(),
        subscribe: (listener) => {
          subscribed.push(listener);
          return () => {}
        },
        getState: () => {
          // return next number on every call
          states.push(states.length);
          return states.length - 1;
        },
        replaceReducer: () => {}
      };
    }
    const dumbDetectorSpy = chai.spy(dumbDetector);
    const detectorEnhancer = createDetectorEnhancer(dumbDetectorSpy);
    const createDetectableStore = detectorEnhancer(createStore);
    const detectableStore = createDetectableStore(dumbReducer, states[0]);
    assert.lengthOf(subscribed, 1);

    expect(detectableStore.dispatch).to.not.have.been.called;

    subscribed[0]();

    expect(dumbDetectorSpy).to.have.been.called.with(0, 1);
    expect(detectableStore.dispatch).to.not.have.been.called;

    subscribed[0]();

    expect(dumbDetectorSpy).to.have.been.called.with(1, 2);
    expect(detectableStore.dispatch).to.not.have.been.called;
  });

  it('should create store that doesn\'t dispatch if detector returns not array', () => {
    let detectorReturn = undefined;
    function dumbReducer(state) {
      return state;
    }
    function scopedDetector() {
      return detectorReturn;
    }
    const dumbState = {};
    const subscribed = [];
    function createStore() {
      return {
        dispatch: chai.spy(),
        subscribe: (listener) => {
          subscribed.push(listener);
          return () => {}
        },
        getState: () => dumbState,
        replaceReducer: () => {}
      };
    }
    const detectorEnhancer = createDetectorEnhancer(scopedDetector);
    const createDetectableStore = detectorEnhancer(createStore);
    const detectableStore = createDetectableStore(dumbReducer, dumbState);

    assert.lengthOf(subscribed, 1);

    subscribed[0]();
    expect(detectableStore.dispatch).to.not.have.been.called;

    subscribed[0]();
    expect(detectableStore.dispatch).to.not.have.been.called;
  });
});
