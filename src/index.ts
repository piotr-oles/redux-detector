// typings
export { Detector } from "./Detector";
export { DetectableStore } from "./DetectableStore";
export { DetectableStoreExt } from "./DetectableStoreExt";

// enhance redux store
export { createDetectorEnhancer } from "./createDetectorEnhancer";

// standard library
export { composeDetectors } from "./composeDetectors";
export { combineDetectors } from "./combineDetectors";
export { mapDetector } from "./mapDetector";
export { mapNextState } from "./mapNextState";
export { mapPrevState } from "./mapPrevState";
export { composeIf } from "./composeIf";
export { composeAnd } from "./composeAnd";
export { composeOr } from "./composeOr";

// standard library changed detectors
export { changed } from "./lib/changed";
export { changedAndFalsy } from "./lib/changedAndFalsy";
export { changedAndTruthy } from "./lib/changedAndTruthy";
export { changedToFalsy } from "./lib/changedToFalsy";
export { changedToTruthy } from "./lib/changedToTruthy";
export { isEqual } from "./lib/isEqual";
export { isFalsy } from "./lib/isFalsy";
export { isTruthy } from "./lib/isTruthy";
export { wasEqual } from "./lib/wasEqual";
export { wasFalsy } from "./lib/wasFalsy";
export { wasTruthy } from "./lib/wasTruthy";
