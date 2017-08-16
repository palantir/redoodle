# `composeReducers(...reducers)`

Redoodle writes a `composeReducers` utility that reduces an action by applying a sequence of delegate reducers.

**Note**: Redoodle's Reducer semantics differ very slightly from Redux's
in regards to initial State handling. In short, Redoodle Reducer's actually
_aren't_ expected to respond to `undefined`, although this can cause initial
integration problems to an existing Redux application. For more,
please check out the [Initial State Management](/docs/InitialState.md) section.

#### Example

```ts
import { coreReducer } from "./coreReducer";
import { tabsStateReducer } from "./tabsStateReducer";

// both `coreReducer` and `tabsStateReducer` are reducers that operate on all of AppState.
// We want both of them to get a turn to reduce incoming actions.
export const appReducer = composeReducers(coreReducer, tabsStateReducer);
```


#### TypeScript definition

```ts
function composeReducers<S>(...reducers: Reducer<S>[]): Reducer<S>;
```
