import { Detector } from "./Detector";

/**
 * Detectable store extension
 */
export interface DetectableStoreExt<S = any> {
  replaceDetector(nextDetector: Detector<S>): void;
}
