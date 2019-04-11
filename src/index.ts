// typings
export { Detector } from "./Detector";
export { DetectableStore } from "./DetectableStore";
export { DetectableStoreExt } from "./DetectableStoreExt";

// enhance redux store
export { createDetectorEnhancer } from "./createDetectorEnhancer";

// standard library
export { composeDetectors } from "./lib/composeDetectors";
export { combineDetectors } from "./lib/combineDetectors";
export { conditionDetector } from "./lib/conditionDetector";
export { mapState } from "./lib/mapState";
export { mapNextState } from "./lib/mapNextState";
export { mapPrevState } from "./lib/mapPrevState";
export { composeAnd } from "./lib/composeAnd";
export { composeOr } from "./lib/composeOr";
export { mapFalsy } from "./lib/mapFalsy";
export { mapTruthy } from "./lib/mapTruthy";

// standard library changed detectors
export { changed } from "./lib/changed/changed";
export { changedFrom } from "./lib/changed/changedFrom";
export { changedFromFalsy } from "./lib/changed/changedFromFalsy";
export { changedFromTruthy } from "./lib/changed/changedFromTruthy";
export { changedTo } from "./lib/changed/changedTo";
export { changedToFalsy } from "./lib/changed/changedToFalsy";
export { changedToTruthy } from "./lib/changed/changedToTruthy";
