# Redux Detector
[![Npm version](https://img.shields.io/npm/v/redux-detector.svg?style=flat-square)](https://www.npmjs.com/package/redux-detector)
[![Build Status](https://travis-ci.org/piotr-oles/redux-detector.svg?branch=master)](https://travis-ci.org/piotr-oles/redux-detector)
[![Coverage Status](https://coveralls.io/repos/github/piotr-oles/redux-detector/badge.svg?branch=master)](https://coveralls.io/github/piotr-oles/redux-detector?branch=master)

Redux [enhancer](http://redux.js.org/docs/api/createStore.html) for pure state changes detection.
 
**Warning: API is not stable yet, will be from version 1.0**

## Installation ##
Redux Detector requires **Redux 3.1.0 or later.**
```sh
npm install --save redux-detector
```
This assumes that you’re using [npm](http://npmjs.com/) package manager with a module bundler like 
[Webpack](http://webpack.github.io/) or [Browserify](http://browserify.org/) to consume 
[CommonJS modules](http://webpack.github.io/docs/commonjs.html).

To enable Redux Detector, use `createDetectableStore`:
```js
import { createDetectableStore } from 'redux-detector';
import rootReducer from './reducers/index';
import rootDetector from './detectors/index';

const store = createDetectableStore(
  rootReducer,
  rootDetector
);
```
 
or if you have more complicated store creation, use `createStore` with `createDetectorEnhancer`:
```js
import { createStore } from 'redux';
import { createDetectorEnhancer } from 'redux-detector';
import rootReducer from './reducers/index';
import rootDetector from './detectors/index';

const store = createStore(
  rootReducer,
  createDetectorEnhancer(rootDetector)
);
```

## Motivation ##
Redux Detector [enhancer](http://redux.js.org/docs/api/createStore.html) allows you to use state changes detectors with redux. 
Detector is a simple and pure function which compares two states and returns list of actions for some states configurations.
It can be used for reacting on particular state transitions.
```typescript
type Detector<S> = <A extends Action>(prevState: S | undefined, nextState: S) => A[] | void
```

For example detector that checks if number of rows exceed 100 looks like this:
```js
function rowsLimitExceededDetector(prevState, nextState) {
  if (prevState.rows.length <= 100 && nextState.rows.length > 100) {
    return [{ type: ROWS_LIMIT_EXCEEDED }];
  }
}
```

Thanks to detectors purity they are predictable and easy to test. There is no problem with features like time-travel, etc.

## Composition ##
Redux store can handle only one detector (and one reducer). But don't worry - you can combine them. To do this, use 
`combineDetectors` function.
```js
// ./detectors/rootDetector.js
import { combineDetectors } from 'redux-detector';
import { fooDetector } from './fooDetector';
import { barDetector } from './barDetector';

export default combineDetectors(fooDetector, barDetector);
```

Detectors by default operates on global state, but if you want to make some reusable detector that is not binded to global state,
you can use `mountDetector` function. With factory pattern it becomes very elastic.
```js
// ./detectors/limitExceedDetector
export default function createLimitExceedDetector(limit, action) {
  return function limitExceedDetector(prevState, nextState) {
    if (prevState <= limit && nextState > limit) {
      return [action];
    }
  }
}

// ./detectors/rowsLimitExceedDetector
import { mountDetector } from 'redux-detector';
import { createLimitExceeedDetector } from './limitExceedDetector';

export const rowsLimitExceedDetector = mountDetector(
  state => state.rows.length,
  createLimitExceedDetector(100, ROWS_LIMIT_EXCEEDED)
);
```
Of course examples above are very trivial, but you can use it to solve more common problems like keeping state consistent
(you can for example schedule resource fetch if some parameters changed).

## License ##
MIT
