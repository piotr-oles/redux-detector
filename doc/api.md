## Redux Detector API

The list of all available functions from the `redux-detector` package.

## Redux related API

### `createDetectorEnhancer(detector: ActionsDetector): StoreEnhancer`

Creates new `StoreDetectableEnhancer` that can be passed as a second parameter of the
`createStore` function from `redux`. This enhancer hooks into store's `dispatch` method
and adds `replaceDetector` method.

<details>
<summary>Example:</summary>

```js
import { createStore } from "redux";
import { createDetectorEnhancer } from "redux-detector";
import { rootReducer } from "./store/rootReducer";
import { rootDetector } from "./store/rootDetector";

const store = createStore(rootReducer, createDetectorEnhancer(rootDetector));
```

</details>

### `store.replaceDetector(detector: ActionsDetector): void`

Features like hot-reloading or code splitting requires hooks to update rootDetector.
You can do it via `replaceDetector` method available on an enhanced store.

<details>
<summary>Hot reloading example:</summary>

```js
if (module.hot) {
  module.hot.accept("./store/rootReducer", async () => {
    const {
      rootReducer: nextRootReducer
    } = await import("./store/rootReducer");
    store.replaceReducer(nextRootReducer);
  });
  module.hot.accept("./store/rootDetector", async () => {
    const {
      rootDetector: nextRootDetector
    } = await import("./store/rootDetector");
    store.replaceDetector(nextRootDetector);
  });
}
```

</details>

## Standard library API

These functions are building blocks for creating more complex detectors.
There is no hidden magic in these functions - they are simple and pure.

### `composeDetectors(...detectors: ActionsDetector[]): ActionsDetector`

Composes many actions detectors into one actions detector. If some of detectors
returns an action or a list of actions, they are merged into one list of actions.

<details>
<summary>Example:</summary>

```js
import { composeDetectors } from "redux-detector";
import { userDetector } from "./user/userDetector";
import { companyDetector } from "./company/companyDetector";

export const rootDetector = composeDetectors(userDetector, companyDetector);
```

</details>

### `combineDetectors(map: ActionsDetectorsMap): ActionsDetector`

Combines many actions detectors into one actions detector. The logic behind is the same
as in the `combineReducers` function.

<details>
<summary>Example:</summary>

```js
import { combineDetectors } from "redux-detector";
import { blockUser } from "./userActions";

export const blockUserOnLoginAttemptsExceededDetector = combineDetectors({
  login: combineDetectors({
    attempts: (prevAttempts, nextAttempts) =>
      prevAttempts < 3 && nextAttempts >= 3 ? blockUser() : undefined
  })
});
```

</details>

### `composeAnd(...detectors: ConditionDetector[]): ConditionDetector`

Composes many condition detectors into one condition detector using `and` operation on
detectors output.

<details>
<summary>Example:</summary>

```js
import { composeAnd, isTruthy } from "redux-detector";
import { exceededLoginLimit } from "./userDetector";
import { isOnAdminZone } from "../security/securitySelector";

export const exceededLimitOnAdminZone = composeAnd(
  isTruthy(isOnAdminZone),
  exceededLoginLimit
);
```

</details>

### `composeOr(...detectors: ConditionDetector[]): ConditionDetector`

Composes many condition detectors into one condition detector using `or` operation on
detectors output.

<details>
<summary>Example:</summary>

```js
import { composeOr } from "redux-detector";
import { exceededLoginLimit, exceededResetPasswordLimit } from "./userDetector";

export const exceededLoginOrResetPasswordLimit = composeOr(
  exceededLoginLimit,
  exceededResetPasswordLimit
);
```

</details>

### `composeIf(condition: ConditionDetector, actions: ActionsDetector): ActionsDetector`

Creates actions detector that runs inner `actions` detector only if `condition` detector
output is truthy.

<details>
<summary>Example:</summary>

```js
import { composeIf } from "redux-detector";
import { exceededLoginLimit } from "./userDetector";
import { blockUser } from "./userActions";

const blockUserOnExceededLimitDetector = composeIf(exceededLoginLimit, () =>
  blockUser()
);
```

</details>
