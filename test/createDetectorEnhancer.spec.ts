import {
  Action,
  applyMiddleware,
  compose,
  createStore,
  Dispatch,
  Middleware,
  Reducer,
  Store
} from "redux";
import {
  ActionsDetector,
  createDetectorEnhancer,
  createDetectorListener,
  DetectableStoreExt
} from "../src";

describe("createDetectorEnhancer", () => {
  let dumbReducer: Reducer;
  let dumbDetector: ActionsDetector;
  let dumbState: any;
  let subscribed: any[];
  let createMockStore: () => Store<any, any>;

  beforeEach(() => {
    dumbReducer = (state = {}) => state;
    dumbDetector = () => [];
    subscribed = [];
    dumbState = {};
    createMockStore = () => ({
      dispatch: jest.fn() as Dispatch,
      subscribe: jest.fn((listener: any) => {
        subscribed.push(listener);
        return () => null;
      }),
      getState: jest.fn(() => dumbState),
      replaceReducer: jest.fn(() => null)
    });
  });

  it("should export createDetectorEnhancer function", () => {
    expect(createDetectorEnhancer).toBeInstanceOf(Function);
  });

  it("should throw an exception if detector is not a function", () => {
    expect(() => {
      (createDetectorEnhancer as any)(undefined);
    }).toThrow();
    expect(() => {
      (createDetectorEnhancer as any)(123);
    }).toThrow();
    expect(() => {
      (createDetectorEnhancer as any)({});
    }).toThrow();
    expect(() => {
      (createDetectorEnhancer as any)([]);
    }).toThrow();
  });

  it("should create enhancer that creates store with DetectableStore interface", () => {
    const createStoreSpy = jest.fn(createMockStore);
    const detectorEnhancer = createDetectorEnhancer(dumbDetector);

    expect(detectorEnhancer).toBeInstanceOf(Function);

    const createDetectableStore = detectorEnhancer(createStoreSpy);

    expect(createStoreSpy).not.toHaveBeenCalled();
    expect(createDetectableStore).toBeInstanceOf(Function);

    const detectableStore = createDetectableStore(dumbReducer, {});

    expect(createStoreSpy).toHaveBeenCalledTimes(1);
    expect(detectableStore).toBeInstanceOf(Object);
    expect(detectableStore.dispatch).toBeDefined();
    expect(detectableStore.subscribe).toBeDefined();
    expect(detectableStore.getState).toBeDefined();
    expect(detectableStore.replaceReducer).toBeDefined();
    expect(detectableStore.replaceDetector).toBeDefined();
    expect(detectableStore.subscribe).toHaveBeenCalledTimes(1);
  });

  it("should create enhancer that creates store with valid replaceDetector function", () => {
    const nextDetector = () => [{ type: "NEXT_DETECTOR_REPLACED" }];
    const nextDetectorSpy = jest.fn(nextDetector);
    const detectorEnhancer = createDetectorEnhancer(dumbDetector);
    const createDetectableStore = detectorEnhancer(createMockStore);
    const detectableStore = createDetectableStore(dumbReducer, dumbState);

    expect(subscribed).toHaveLength(1);

    expect(() => {
      (detectableStore.replaceDetector as any)("invalid type");
    }).toThrow();

    expect(detectableStore.dispatch).not.toHaveBeenCalled();

    detectableStore.replaceDetector(nextDetectorSpy);
    expect(detectableStore.dispatch).toHaveBeenCalledWith({
      type: "@@detector/INIT"
    });
    const prevDumbState = dumbState;
    dumbState = { next: true };

    // run `detectActions` method
    subscribed[0]();

    expect(nextDetectorSpy).toHaveBeenCalledWith(prevDumbState, dumbState);
    expect(detectableStore.dispatch).toHaveBeenCalledWith({
      type: "NEXT_DETECTOR_REPLACED"
    });
  });

  it("should create store that dispatch if detectors returns single action", () => {
    const singleDetector = () => ({ type: "SINGLE_ACTION" });
    const detectorEnhancer = createDetectorEnhancer(singleDetector);
    const createDetectableStore = detectorEnhancer(createMockStore);
    const detectableStore = createDetectableStore(dumbReducer, dumbState);

    expect(subscribed).toHaveLength(1);

    subscribed[0]();
    expect(detectableStore.dispatch).toHaveBeenCalledWith({
      type: "SINGLE_ACTION"
    });
  });

  it("should create store that runs detector on every subscribe", () => {
    const dumbDetectorSpy = jest.fn(dumbDetector);
    const detectorEnhancer = createDetectorEnhancer(dumbDetectorSpy);
    const createDetectableStore = detectorEnhancer(createMockStore);
    const detectableStore = createDetectableStore(dumbReducer, dumbState);
    expect(subscribed).toHaveLength(1);

    expect(detectableStore.dispatch).not.toHaveBeenCalled();

    let prevDumbState = dumbState;
    dumbState = { next: 1 };

    subscribed[0]();

    expect(dumbDetectorSpy).toHaveBeenCalledWith(prevDumbState, dumbState);
    expect(detectableStore.dispatch).not.toHaveBeenCalled();

    prevDumbState = dumbState;
    dumbState = { next: 2 };

    subscribed[0]();

    expect(dumbDetectorSpy).toHaveBeenCalledWith(prevDumbState, dumbState);
    expect(detectableStore.dispatch).not.toHaveBeenCalled();
  });

  it("should create store that doesn't dispatch if detector returns not array or single action", () => {
    const detectorReturn = undefined;
    const scopedDetector = () => detectorReturn;

    const detectorEnhancer = createDetectorEnhancer(scopedDetector);
    const createDetectableStore = detectorEnhancer(createMockStore);
    const detectableStore = createDetectableStore(dumbReducer, dumbState);

    expect(subscribed).toHaveLength(1);

    subscribed[0]();
    expect(detectableStore.dispatch).not.toHaveBeenCalled();

    subscribed[0]();
    expect(detectableStore.dispatch).not.toHaveBeenCalled();
  });

  it("should create store that dispatches actions from detector in chronological order", () => {
    const reducerHistory: [string, any][] = [];
    const detectorHistory: [number, number][] = [];

    const incrementBy = (payload: number) => ({ type: "INCREMENT", payload });
    const multiplyBy = (payload: number) => ({ type: "MULTIPLY", payload });

    const reducer = (
      counter = 0,
      action: { type: string; payload?: number }
    ) => {
      reducerHistory.push([action.type, action.payload]);

      switch (action.type) {
        case "INCREMENT":
          return counter + action.payload!;
        case "MULTIPLY":
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

    const counterStore = createStore(
      reducer,
      0,
      createDetectorEnhancer<number>(detector)
    );
    counterStore.dispatch(incrementBy(1));

    expect(reducerHistory).toEqual([
      [expect.any(String), undefined], // 0
      ["INCREMENT", 1], // 1
      ["INCREMENT", 1], // 2
      ["MULTIPLY", 2], // 4
      ["INCREMENT", 1] // 5
    ]);
    expect(detectorHistory).toEqual([[0, 1], [1, 2], [2, 4], [4, 5]]);
    expect(counterStore.getState()).toEqual(5);
  });

  it("should call listener after dispatch", () => {
    const onNext = jest.fn();
    const onError = jest.fn();

    const increment: Action = { type: "INCREMENT" };
    const fire: Action = { type: "FIRE" };
    const exception: Action = { type: "EXCEPTION" };
    const error = new Error("");
    const reducer: Reducer<number, Action> = (state = 0, { type }) => {
      switch (type) {
        case "INCREMENT":
          return state + 1;

        case "FIRE":
          return -1;

        case "EXCEPTION":
          throw error;

        default:
          return state;
      }
    };
    const detector: ActionsDetector<number> = (
      prevState = 0,
      nextState = 0
    ) => {
      if (nextState < 0) {
        return exception;
      }

      if (prevState % 2 === 0) {
        return increment;
      }
    };
    const listener = createDetectorListener(onNext, onError);
    const initialState = 0;

    const store = createStore<number, Action, DetectableStoreExt, {}>(
      reducer,
      initialState,
      createDetectorEnhancer(detector, listener)
    );

    // call onNext listener
    store.dispatch(increment);

    expect(onNext).toHaveBeenCalledWith(increment, increment, {
      dispatch: expect.anything(),
      getState: expect.anything()
    });
    expect(onError).not.toHaveBeenCalled();

    // call onError listener
    store.dispatch(fire);

    expect(onError).toHaveBeenCalledWith(error, exception, {
      dispatch: expect.anything(),
      getState: expect.anything()
    });
  });

  it("should prevent UnhandledPromiseRejection error", async () => {
    const onNext = jest.fn();
    const onError = jest.fn();

    const error = new Error("");
    const fire: Action = { type: "FIRE" };
    const exception = () =>
      new Promise((resolve, reject) => setTimeout(() => reject(error), 500));
    const reducer: Reducer<number, any> = (state = 0, { type }) => {
      if (type === "FIRE") {
        return -1;
      }

      return state;
    };
    const detector: ActionsDetector<number> = (
      prevState = 0,
      nextState = 0
    ) => {
      if (nextState < 0) {
        return exception;
      }
    };
    const listener = createDetectorListener(onNext, onError);
    const initialState = 0;
    const thunkMiddleware: Middleware = ({
      dispatch,
      getState
    }) => next => action => {
      if (typeof action === "function") {
        return action(dispatch, getState);
      }

      return next(action);
    };

    const store = createStore<number, Action, DetectableStoreExt, {}>(
      reducer,
      initialState,
      compose(
        createDetectorEnhancer(detector, listener),
        applyMiddleware(thunkMiddleware)
      )
    );

    store.dispatch<any>(fire);

    // wait 1 second for promise to be rejected
    await new Promise(resolve => setTimeout(resolve, 1000));
    // if we get here it means that UnhandledPromiseRejection wasn't thrown

    expect(onNext).toHaveBeenCalledWith(expect.any(Promise), exception, {
      dispatch: expect.anything(),
      getState: expect.anything()
    });
    expect(onError).not.toHaveBeenCalled();
  });
});
