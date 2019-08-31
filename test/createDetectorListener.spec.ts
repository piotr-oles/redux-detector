import { createDetectorListener } from "../src";

describe("createDetectorListener", () => {
  it("should create new detector listener", () => {
    const onNext = jest.fn();
    const onError = jest.fn();

    const listener = createDetectorListener(onNext, onError);
    expect(listener).toEqual({
      next: onNext,
      error: onError
    });
  });

  it("should allow undefined onNext", () => {
    const onError = jest.fn();

    const listener = createDetectorListener(undefined, onError);
    expect(listener).toEqual({
      next: undefined,
      error: onError
    });
  });

  it("should allow undefined onError", () => {
    const onNext = jest.fn();

    const listener = createDetectorListener(onNext);
    expect(listener).toEqual({
      next: onNext,
      error: undefined
    });
  });
});
