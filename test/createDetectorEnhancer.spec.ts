import { createDetectorEnhancer } from '../src';
import {AnyAction, createStore, Store} from 'redux';

describe('createDetectorEnhancer', () => {

  it('should export createDetectorEnhancer function', () => {
    expect(createDetectorEnhancer).toBeInstanceOf(Function);
  });

  it('should throw an exception if detector is not a function', () => {
    expect(() => { (createDetectorEnhancer as any)(undefined); }).toThrow();
    expect(() => { (createDetectorEnhancer as any)(123); }).toThrow();
    expect(() => { (createDetectorEnhancer as any)({}); }).toThrow();
    expect(() => { (createDetectorEnhancer as any)([]); }).toThrow();
  });

  it('should create enhancer that creates store with DetectableStore interface', () => {
    function dumbReducer(state: any) {
      return state;
    }
    function dumbDetector() {
      return [];
    }
    const dumbState = {};
    function createMockStore() {
      return {
        dispatch: () => null,
        subscribe: jest.fn(() => () => null),
        getState: () => dumbState,
        replaceReducer: () => null,
      } as Store<any, any>;
    }
    const createStoreSpy = jest.fn(createMockStore);
    const detectorEnhancer = createDetectorEnhancer(dumbDetector);

    expect(detectorEnhancer).toBeInstanceOf(Function);

    const createDetectableStore = detectorEnhancer(createStoreSpy);

    expect(createStoreSpy).not.toHaveBeenCalled();
    expect(createDetectableStore).toBeInstanceOf(Function);

    const detectableStore = createDetectableStore(dumbReducer, dumbState);

    expect(createStoreSpy).toHaveBeenCalledTimes(1);
    expect(detectableStore).toBeInstanceOf(Object);
    expect(detectableStore.dispatch).toBeDefined();
    expect(detectableStore.subscribe).toBeDefined();
    expect(detectableStore.getState).toBeDefined();
    expect(detectableStore.replaceReducer).toBeDefined();
    expect(detectableStore.replaceDetector).toBeDefined();
    expect(detectableStore.subscribe).toHaveBeenCalledTimes(1);
  });

  it('should create enhancer that creates store with valid replaceDetector function', () => {
    function dumbReducer(state: any) {
      return state;
    }
    function dumbDetector() {
      return [];
    }
    function nextDetector() {
      return [{ type: 'NEXT_DETECTOR_REPLACED' }];
    }
    const states = [0];
    const subscribed: any[] = [];
    function createMockStore() {
      return {
        dispatch: jest.fn(),
        subscribe: (listener: any) => {
          subscribed.push(listener);
          return () => null
        },
        getState: () => {
          // return next number on every call
          states.push(states.length);
          return states.length - 1;
        },
        replaceReducer: jest.fn()
      } as Store<any, any>;
    }
    const nextDetectorSpy = jest.fn(nextDetector);
    const detectorEnhancer = createDetectorEnhancer(dumbDetector);
    const createDetectableStore = detectorEnhancer(createMockStore);
    const detectableStore = createDetectableStore(dumbReducer, states[0] as any);
    expect(subscribed).toHaveLength(1);

    expect(() => { (detectableStore.replaceDetector as any)('invalid type'); }).toThrow();

    expect(detectableStore.dispatch).not.toHaveBeenCalled();

    detectableStore.replaceDetector(nextDetectorSpy);
    expect(detectableStore.dispatch).toHaveBeenCalledWith({ type: '@@detector/INIT' });

    // run `detectActions` method
    subscribed[0]();

    expect(nextDetectorSpy).toHaveBeenCalledWith(0, 1);
    expect(detectableStore.dispatch).toHaveBeenCalledWith({ type: 'NEXT_DETECTOR_REPLACED' });
  });

  it('should create store that dispatch if detectors returns single action', () => {
    function dumbReducer(state: any) {
      return state;
    }
    function singleDetector() {
      return { type: 'SINGLE_ACTION' };
    }
    const dumbState = {};
    const subscribed: any[] = [];
    function createMockStore() {
      return {
        dispatch: jest.fn(),
        subscribe: (listener: any) => {
          subscribed.push(listener);
          return () => null
        },
        getState: () => dumbState,
        replaceReducer: () => null
      } as Store<any, any>;
    }
    const detectorEnhancer = createDetectorEnhancer(singleDetector);
    const createDetectableStore = detectorEnhancer(createMockStore);
    const detectableStore = createDetectableStore(dumbReducer, dumbState);

    expect(subscribed).toHaveLength(1);

    subscribed[0]();
    expect(detectableStore.dispatch).toHaveBeenCalledWith({ type: 'SINGLE_ACTION' });
  });

  it('should create store that runs detector on every subscribe', () => {
    function dumbReducer(state: any) {
      return state;
    }
    function dumbDetector() {
      return [];
    }
    const states = [0];
    const subscribed: any[] = [];
    function createMockStore() {
      return {
        dispatch: jest.fn(),
        subscribe: (listener: any) => {
          subscribed.push(listener);
          return () => null
        },
        getState: () => {
          // return next number on every call
          states.push(states.length);
          return states.length - 1;
        },
        replaceReducer: () => null
      } as Store<any, any>;
    }
    const dumbDetectorSpy = jest.fn(dumbDetector);
    const detectorEnhancer = createDetectorEnhancer(dumbDetectorSpy);
    const createDetectableStore = detectorEnhancer(createMockStore);
    const detectableStore = createDetectableStore(dumbReducer, states[0] as any);
    expect(subscribed).toHaveLength(1);

    expect(detectableStore.dispatch).not.toHaveBeenCalled();

    subscribed[0]();

    expect(dumbDetectorSpy).toHaveBeenCalledWith(0, 1);
    expect(detectableStore.dispatch).not.toHaveBeenCalled();

    subscribed[0]();

    expect(dumbDetectorSpy).toHaveBeenCalledWith(1, 2);
    expect(detectableStore.dispatch).not.toHaveBeenCalled();
  });

  it('should create store that doesn\'t dispatch if detector returns not array or single action', () => {
    const detectorReturn = undefined;
    function dumbReducer(state: any) {
      return state;
    }
    function scopedDetector() {
      return detectorReturn;
    }
    const dumbState = {};
    const subscribed: any[] = [];
    function createMockStore() {
      return {
        dispatch: jest.fn(),
        subscribe: (listener: any) => {
          subscribed.push(listener);
          return () => null
        },
        getState: () => dumbState,
        replaceReducer: () => null
      } as Store<any, any>;;
    }
    const detectorEnhancer = createDetectorEnhancer(scopedDetector);
    const createDetectableStore = detectorEnhancer(createMockStore);
    const detectableStore = createDetectableStore(dumbReducer, dumbState);

    expect(subscribed).toHaveLength(1);

    subscribed[0]();
    expect(detectableStore.dispatch).not.toHaveBeenCalled();

    subscribed[0]();
    expect(detectableStore.dispatch).not.toHaveBeenCalled();
  });

  it('should create store that dispatches actions from detector in chronological order', () => {
    const reducerHistory: [string, any][] = [];
    const detectorHistory: [number, number][] = [];

    const incrementBy = (payload: number) => ({ type: 'INCREMENT', payload });
    const multiplyBy = (payload: number) => ({ type: 'MULTIPLY', payload });

    const reducer = (counter = 0, action: { type: string, payload?: number }) => {
      reducerHistory.push([action.type, action.payload]);

      switch (action.type) {
        case 'INCREMENT':
          return counter + action.payload!;
        case 'MULTIPLY':
          return counter * action.payload!;
        default:
          return counter;
      }
    };
    const detector = (prevCounter?: number, nextCounter?: number) => {
      detectorHistory.push([prevCounter || 0, nextCounter || 0]);

      // when counter == 1
      if (prevCounter !== nextCounter && nextCounter === 1) {
        return [incrementBy(1), multiplyBy(2)];
      }
      // when counter == 2
      if (prevCounter !== nextCounter && nextCounter === 2) {
        return incrementBy(1);
      }
    };

    const counterStore = createStore(reducer, 0, createDetectorEnhancer<number>(detector));
    counterStore.dispatch(incrementBy(1));

    expect(reducerHistory).toEqual([
      [expect.any(String), undefined], // 0
      ['INCREMENT', 1], // 1
      ['INCREMENT', 1], // 2
      ['MULTIPLY', 2], // 4
      ['INCREMENT', 1], // 5
    ]);
    expect(detectorHistory).toEqual([
      [0, 1],
      [1, 2],
      [2, 4],
      [4, 5]
    ]);
    expect(counterStore.getState()).toEqual(5);
  });
});
