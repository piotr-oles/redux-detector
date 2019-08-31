import { composeDetectorListeners, createDetectorListener } from "../src";

describe("composeDetectorListeners", () => {
  let action: any;
  let api: any;

  beforeEach(() => {
    action = { type: "FOO" };
    api = {
      dispatch: jest.fn(),
      getState: () => true
    };
  });

  it("should compose many detector listeners", () => {
    const onNextA = jest.fn();
    const onNextB = jest.fn();
    const onErrorB = jest.fn();
    const onErrorC = jest.fn();

    const listenerA = createDetectorListener(onNextA);
    const listenerB = createDetectorListener(onNextB, onErrorB);
    const listenerC = createDetectorListener(undefined, onErrorC);
    const listener = composeDetectorListeners(listenerA, listenerB, listenerC);

    // test next call
    expect(onNextA).not.toHaveBeenCalled();
    expect(onNextB).not.toHaveBeenCalled();

    expect(listener.next).toBeDefined();

    const nextParams: [any, any, any] = [true, action, api];

    const nextResult = listener.next!(...nextParams);
    expect(nextResult).toBeUndefined();
    expect(onNextA).toHaveBeenCalledWith(...nextParams);
    expect(onNextB).toHaveBeenCalledWith(...nextParams);

    // test error call
    expect(onErrorB).not.toHaveBeenCalled();
    expect(onErrorC).not.toHaveBeenCalled();

    expect(listener.error).toBeDefined();

    const errorParams: [any, any, any] = [new Error(""), action, api];

    const errorResult = listener.error!(...errorParams);
    expect(errorResult).toBeUndefined();
    expect(onErrorB).toHaveBeenCalledWith(...errorParams);
    expect(onErrorC).toHaveBeenCalledWith(...errorParams);
  });

  it("should compose empty array of listeners", () => {
    const listener = composeDetectorListeners();

    expect(listener.next).toBeDefined();
    expect(listener.error).toBeDefined();

    expect(() => listener.next!(true, action, api)).not.toThrowError();
    expect(() =>
      listener.error!(new Error(""), action, api)
    ).not.toThrowError();
  });

  it("should compose array of empty listeners", () => {
    const listenerA = createDetectorListener();
    const listenerB = createDetectorListener();
    const listenerC = createDetectorListener();
    const listener = composeDetectorListeners(listenerA, listenerB, listenerC);

    expect(listener.next).toBeDefined();
    expect(listener.error).toBeDefined();

    expect(() => listener.next!(true, action, api)).not.toThrowError();
    expect(() =>
      listener.error!(new Error(""), action, api)
    ).not.toThrowError();
  });
});
