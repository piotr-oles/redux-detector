import { DetectorListener } from "./DetectorListener";

/**
 * Composes many listeners into on listener. They will be called in the order that they were passed to this function.
 *
 * @param listeners
 */
export function composeDetectorListeners(
  ...listeners: DetectorListener[]
): DetectorListener {
  return {
    next: (result, action, api) =>
      listeners.forEach(
        listener => listener.next && listener.next(result, action, api)
      ),
    error: (error, action, api) =>
      listeners.forEach(
        listener => listener.error && listener.error(error, action, api)
      )
  };
}
