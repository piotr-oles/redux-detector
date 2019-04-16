# Redux Detector

[![Npm version](https://img.shields.io/npm/v/redux-detector.svg?style=flat-square)](https://www.npmjs.com/package/redux-detector)
[![Build Status](https://travis-ci.org/piotr-oles/redux-detector.svg?branch=master)](https://travis-ci.org/piotr-oles/redux-detector)
[![Coverage Status](https://coveralls.io/repos/github/piotr-oles/redux-detector/badge.svg?branch=master)](https://coveralls.io/github/piotr-oles/redux-detector?branch=master)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Redux [enhancer](http://redux.js.org/docs/api/createStore.html) for pure detection of state changes.

**Warning: API is not stable yet, will be from version 1.0**

## Installation

Redux Detector requires **Redux 3.1.0 or later.**

```sh
npm install --save redux-detector
```

This assumes that you’re using [npm](http://npmjs.com/) package manager with a module bundler like
[Webpack](http://webpack.github.io/) or [Browserify](http://browserify.org/) to consume
[CommonJS modules](http://webpack.github.io/docs/commonjs.html).

To enable Redux Detector, use `createDetectorEnhancer`:

```js
import { createStore } from "redux";
import { createDetectorEnhancer } from "redux-detector";
import rootReducer from "./reducers";
import rootDetector from "./detectors";

const store = createStore(rootReducer, createDetectorEnhancer(rootDetector));
```

## Motivation

Redux Detector [enhancer](http://redux.js.org/docs/api/createStore.html) allows you to detect state changes in the redux.
An actions detector is a simple and pure function which compares two states and returns action or list of actions for given states transitions.

```typescript
type ActionsDetector<TState, TAction extends Action = AnyAction> = (
  prevState: TState | undefined,
  nextState: TState | undefined
) => TAction | TAction[] | void;
```

For example detector that checks if number of rows exceed 100 looks like this:

```js
function rowsLimitExceededDetector(prevState, nextState) {
  if (prevState.rows.length <= 100 && nextState.rows.length > 100) {
    return { type: ROWS_LIMIT_EXCEEDED };
  }
}
```

You can also return an array of actions or nothing (undefined).
Thanks to detectors purity they are predictable and easy to test. There is no problem with features like time-travel, etc.

## Composition

Redux store can handle only one detector (and one reducer). But don't worry - you can combine and compose them. To do this, use
`combineDetectors` and `composeDetectors` functions.

```js
// ./detectors/rootDetector.js
import { combineDetectors, composeDetectors } from "redux-detector";
import { fooDetector } from "./fooDetector";
import { barDetector } from "./barDetector";
import { anotherDetector } from "./anotherDetector";

// our state has shape:
// {
//   foo: [],
//   bar: 1
// }
//
// We want to bind `fooDetector` and `anotherDetector` to `state.foo` branch (they should run in sequence)
// and also `barDetector` to `state.bar` branch.

export default combineDetectors({
  foo: composeDetectors(fooDetector, anotherDetector),
  bar: barDetector
});
```

Another way to re-use local state detectors is to mount them with `mapState` function. Combine detectors work only on objects level -
if you want to use detectors on more nested data, you should mount them. With factory pattern, it becomes very elastic.

```js
// ./detectors/limitExceedDetector.js
export function createLimitExceedDetector(limit, action) {
  return function limitExceedDetector(prevState, nextState) {
    if (prevState <= limit && nextState > limit) {
      return action;
    }
  };
}

// ./detectors/rowsLimitExceedDetector.js
import { mapState } from "redux-detector";
import { createLimitExceeedDetector } from "./limitExceedDetector";

export const rowsLimitExceedDetector = mapState(
  state => state.rows.length,
  createLimitExceedDetector(100, ROWS_LIMIT_EXCEEDED)
);
```

Of course, examples above are very trivial, but you can use it to solve more common problems
(you can, for example, schedule resource fetch on parameters change).

## Condition detector

The most common use case is to detect if some condition has been changed. As the condition can become very complex,
this library provides few functions that helps to create such detectors.

That's how we can implement detector that will fetch users list if we are on the users page and pagination or filters changed:

```typescript
import {
  conditionDetector,
  composeOr,
  composeAnd,
  mapState,
  mapNextState,
  changedPositive
} from "redux-detector";
import { hasMatch } from "./routerSelectors";
import { getUserPagination, getUserFilters } from "./userSelectors";
import { fetchUsers } from "./userActions";
import { USERS_ROUTE } from "./routes";

const usersListDetector = conditionDetector(
  composeOr(
    mapState(hasMatch(USERS_ROUTE), changedPositive), // case 1 - we have entered users page
    composeAnd(
      // case 2 - we are on the users page and pagination or filters changed
      mapNextState(hasMatch(USERS_ROUTE)),
      composeOr(
        mapState(getUserPagination, changedPositive),
        mapState(getUserFilters, changedPositive)
      )
    )
  ),
  () => fetchUsers()
);
```

## Code splitting

Redux Detector provides `replaceDetector` method on `DetectableStore` interface (store created by Redux Detector). It's similar to
`replaceReducer` - it changes detector and dispatches `{ type: '@@detector/INIT' }`.

## Typings

If you are using [TypeScript](https://www.typescriptlang.org/), you don't have to install typings - they are provided in npm package.

## License

MIT
