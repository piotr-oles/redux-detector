<div align="center">

<h1>Redux Detector</h1>
<p>Redux enhancer for pure detection of state changes 👀</p>

[![npm version](https://img.shields.io/npm/v/redux-detector.svg)](https://www.npmjs.com/package/redux-detector)
[![build Status](https://travis-ci.org/piotr-oles/redux-detector.svg?branch=master)](https://travis-ci.org/piotr-oles/redux-detector)
[![coverage Status](https://coveralls.io/repos/github/piotr-oles/redux-detector/badge.svg?branch=master)](https://coveralls.io/github/piotr-oles/redux-detector?branch=master)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

</div>

**Warning: API is not stable yet, will be from version 1.0**

## Table of Contents 📋

- [Installation 📦](#installation)
- [Concept 💡](#concept)
- [Basics 👈](#basics)
- [API reference 📖](doc/api.md)
- [Code splitting ✂️](#code-splitting️)
- [Typings 📐](#typings)
- [License](#license)

## Installation 📦

Redux Detector requires **Redux 3.1.0 or later.**

```sh
npm install --save redux-detector
```

This assumes that you’re using [npm](http://npmjs.com/) package manager with a module bundler like
[Webpack](https://webpack.js.org/) to consume [ES6](https://webpack.js.org/api/module-methods/#es6-recommended) or
[CommonJS](https://webpack.js.org/api/module-methods/#commonjs) modules.

To enable Redux Detector, use `createDetectorEnhancer`:

```js
import { createStore } from "redux";
import { createDetectorEnhancer } from "redux-detector";
import { rootReducer } from "./store/reducer/rootReducer";
import { rootDetector } from "./store/detector/rootDetector";

const store = createStore(rootReducer, createDetectorEnhancer(rootDetector));
```

## Concept 💡

Redux Detector [enhancer](http://redux.js.org/docs/api/createStore.html) allows you to **detect state changes** in the Redux.

The **`Detector`** is a pure function which accepts previous and next state and returns something for given states transition.

```typescript
type Detector<TState, TResult> = (
  prevState: TState | undefined,
  nextState: TState | undefined
) => TResult;
```

The **`Actions Detector`** is a `Detector` which returns action, list of actions or nothing.
Returned actions are automatically dispatched by the enhancer.

```typescript
import { Detector } from "redux-detector";
import { Action } from "redux";

type ActionsDetector<TState, TAction extends Action> = Detector<
  TState,
  TAction | TAction[] | void
>;
```

Another type of the detector is the **`Condition Detector`** which returns boolean values.

```typescript
import { Detector } from "redux-detector";

type ConditionDetector<TState> = Detector<TState, boolean>;
```

These two types of detectors have different responsibility:

- `Condition Detectors` describes a condition that we want to detect
- `Actions Detectors` describes which action we want to dispatch

Thanks to its functional nature and purity, detectors are easy to test. They don't break [Single Source of Truth principle](https://en.wikipedia.org/wiki/Single_source_of_truth)
as the input is only previous and next state.

## Basics 👈

Let's start simply - implement a condition detector that checks if number of login attempts exceeded 3.

```typescript
export const exceededLoginAttemptsLimit = (prevState, nextState) =>
  prevState.attempts <= 3 && nextState.attempts > 3;
```

We can make above example more generic - `prevState.attempts <= 3` is the same as `!(prevState.attempts > 3)`.
That means that we check if some condition is **not truthy** for the _previous state_ but is **truthy** for the _next state_.
This kind of transition can be handled by the `changedToTruthy` function.

```typescript
import { changedToTruthy } from "redux-detector";

export const exceededLoginAttemptsLimit = changedToTruthy(
  state => state.attempts > 3
);
```

> Redux Detector library provides other useful functions to model condition detectors - please check the
> [API documentation](doc/api.md) to learn more.

The next step is to use an action detector to dispatch an action when the limit became exceeded.
To do so, we will use `composeIf` function.

```typescript
import { composeIf, changedToTruthy } from "redux-detector";
import { blockUser } from "../action/userAction";

const blockUserDetector = composeIf(
  changedToTruthy(state => state.attempts > 3),
  () => blockUser()
);
```

The `createDetectorEnhancer` function accepts only one detector, so we have to compose all
detectors to the one `rootDetector`.

```typescript
import { composeDetectors } from "redux-detector";
import { blockUserDetector } from "./userDetector";
// other detectors...
import { companyDetector } from "./companyDetector";

export const rootDetector = composeDetectors(
  blockUserDetector,
  companyDetector
);
```

And that's all - `redux-detector` will dispatch `blockUser()` when login attempts exceeded 3 🎉

## [API reference 📖](doc/api.md)

For more detailed documentation, please check API reference.

## Code splitting ✂️

Redux Detector provides `replaceDetector` method on `DetectableStore` interface (store created by Redux Detector). It's similar to
`replaceReducer` - it changes detector and dispatches `{ type: '@@detector/INIT' }`.

## Typings 📐

If you are using [TypeScript](https://www.typescriptlang.org/), typings are provided in the npm package.
This library doesn't provide [Flow](https://flow.org/) typings.

## License

MIT
