
import * as chai from 'chai';
import * as spies from 'chai-spies';
import { assert, expect } from 'chai';
import { createDetectorEnhancer } from '../src/index';
import { createStore } from 'redux';

chai.use(spies);

describe('createDetectableStore', () => {

  it('should export createDetectorEnhancer function', () => {
    assert.isFunction(createDetectorEnhancer);
  });

  it('should throw an exception if detector is not a function', () => {
    assert.throws(() => { (createDetectorEnhancer as any)(undefined); }, Error);
    assert.throws(() => { (createDetectorEnhancer as any)(123); }, Error);
    assert.throws(() => { (createDetectorEnhancer as any)({}); }, Error);
    assert.throws(() => { (createDetectorEnhancer as any)([]); }, Error);
  });

  it('should create enhancer that creates store with DetectableStore interface', () => {
    function dumbReducer(state) {
      return state;
    }
    function dumbDetector() {
      return [];
    }
    const dumbState = {};
    function createMockStore() {
      return {
        dispatch: () => {},
        subscribe: chai.spy(),
        getState: () => dumbState,
        replaceReducer: () => {}
      };
    }
    const createStoreSpy = chai.spy(createMockStore);
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
    function createMockStore() {
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
    const createDetectableStore = detectorEnhancer(createMockStore);
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

  it('should create store that dispatch if detectors returns single action', () => {
    function dumbReducer(state) {
      return state;
    }
    function singleDetector() {
      return { type: 'SINGLE_ACTION' };
    }
    const dumbState = {};
    const subscribed = [];
    function createMockStore() {
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
    const detectorEnhancer = createDetectorEnhancer(singleDetector);
    const createDetectableStore = detectorEnhancer(createMockStore);
    const detectableStore = createDetectableStore(dumbReducer, dumbState);

    assert.lengthOf(subscribed, 1);

    subscribed[0]();
    expect(detectableStore.dispatch).to.have.been.called.once.with({ type: 'SINGLE_ACTION' });
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
    function createMockStore() {
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
    const createDetectableStore = detectorEnhancer(createMockStore);
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

  it('should create store that doesn\'t dispatch if detector returns not array or single action', () => {
    let detectorReturn = undefined;
    function dumbReducer(state) {
      return state;
    }
    function scopedDetector() {
      return detectorReturn;
    }
    const dumbState = {};
    const subscribed = [];
    function createMockStore() {
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
    const createDetectableStore = detectorEnhancer(createMockStore);
    const detectableStore = createDetectableStore(dumbReducer, dumbState);

    assert.lengthOf(subscribed, 1);

    subscribed[0]();
    expect(detectableStore.dispatch).to.not.have.been.called;

    subscribed[0]();
    expect(detectableStore.dispatch).to.not.have.been.called;
  });

  it('should create store that dispatches actions from detector in chronological order', () => {
    const reducerHistory = [];
    const detectorHistory = [];

    const incrementBy = (number) => ({ type: 'INCREMENT', payload: number });
    const multiplyBy = (number) => ({ type: 'MULTIPLY', payload: number });

    const reducer = (counter = 0, action) => {
      reducerHistory.push([action.type, action.payload]);

      switch (action.type) {
        case 'INCREMENT':
          return counter + action.payload;
        case 'MULTIPLY':
          return counter * action.payload;
        default:
          return counter;
      }
    };
    const detector = (prevCounter, nextCounter) => {
      detectorHistory.push([prevCounter, nextCounter]);

      // when counter == 1
      if (prevCounter !== nextCounter && nextCounter === 1) {
        return [incrementBy(1), multiplyBy(2)];
      }
      // when counter == 2
      if (prevCounter !== nextCounter && nextCounter === 2) {
        return incrementBy(1);
      }
      // when counter == 4
      if (prevCounter !== nextCounter && nextCounter === 4) {
        return incrementBy(1);
      }
    };

    const counterStore = createStore(reducer, 0, createDetectorEnhancer(detector));
    counterStore.dispatch(incrementBy(1));

    expect(reducerHistory).to.be.deep.equals([
      ['@@redux/INIT', undefined], // 0
      ['INCREMENT', 1], // 1
      ['INCREMENT', 1], // 2
      ['MULTIPLY', 2], // 4
      ['INCREMENT', 1], // 5
    ]);
    expect(detectorHistory).to.be.deep.equals([
      [0, 1],
      [1, 4],
      [4, 5]
    ]);
    expect(counterStore.getState()).to.be.equals(5);
  });
});
