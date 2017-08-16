# `createStore(reducer, initialState, [enhancer])`

Redoodle packages a version of `createStore` that
requires initial state.
This function is more included for completeness,
and lacks some useful features that the Redux core `createStore` has,
such as clean Observables integration and more complete runtime usage checks.

If the lost features are important to you, please do use the version of `createStore`
exposed by Redux.

For more about store enhancers, see the Redux [documentation](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#store-enhancer).

**Note**: Redoodle's Reducer semantics differ very slightly from Redux's
in regards to initial State handling. In short, Redoodle Reducer's actually
_aren't_ expected to respond to `undefined`, although this can cause initial
integration problems to an existing Redux application. For more,
please check out the [Initial State Management](/docs/InitialState.md) section.

#### Example

```ts
import { Action, createStore } from "redoodle";

interface AppState {
  foo: string;
}

function reducer(state: AppState, action: Action) {
  return state;
}

const store = createStore<AppState>(reducer, {foo: "initial"});
```

#### TypeScript definition

```ts
function createStore<S>(reducer: Reducer<S>, initialState: S, enhancer?: StoreEnhancer): Store<S>;
```

```ts
interface StoreEnhancer {
  <S>(next: StoreCreator<S>): StoreCreator<S>;
}
```
