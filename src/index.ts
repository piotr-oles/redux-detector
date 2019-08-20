// typings
export { Detector } from "./Detector";
export { DetectableStore } from "./DetectableStore";
export { DetectableStoreExt } from "./DetectableStoreExt";

// enhance redux store
export { createDetectorEnhancer } from "./createDetectorEnhancer";

// standard library
export { composeDetectors } from "./lib/composeDetectors";
export { combineDetectors } from "./lib/combineDetectors";
export { mapDetector } from "./lib/mapDetector";
export { mapNextState } from "./lib/mapNextState";
export { mapPrevState } from "./lib/mapPrevState";
export { composeIf } from "./lib/composeIf";
export { composeAnd } from "./lib/composeAnd";
export { composeOr } from "./lib/composeOr";
export { changed } from "./lib/changed";
export { changedAndFalsy } from "./lib/changedAndFalsy";
export { changedAndTruthy } from "./lib/changedAndTruthy";
export { changedToFalsy } from "./lib/changedToFalsy";
export { changedToTruthy } from "./lib/changedToTruthy";
export { isEqual } from "./lib/isEqual";
export { isFalsy } from "./lib/isFalsy";
export { isTruthy } from "./lib/isTruthy";
