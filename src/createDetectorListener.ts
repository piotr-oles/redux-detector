import { DetectorListener } from "./DetectorListener";

/**
 * Creates new DetectorListener
 *
 * @param onNext callback for successful dispatched action
 * @param onError callback for dispatch that throws an error
 */
export function createDetectorListener(
  onNext?: DetectorListener["next"],
  onError?: DetectorListener["error"]
): DetectorListener {
  return {
    next: onNext,
    error: onError
  };
}
