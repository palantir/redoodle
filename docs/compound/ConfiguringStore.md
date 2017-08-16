# Configuring the Store

CompoundActions can simplify your action creator functions and reduce
the boilerplate of creating many different combinations of Action types,
but the Redux store must be taught how to correctly unwrap them to apply
the Reducer to each wrapped action individually.

There are two ways that Redoodle offers to prepare your store out of the box,
`reduceCompoundActions(reducer)` and `compoundActionsEnhancer()`.
In their standard usage as outlined below, they are equivalent.

#### Example: `reduceCompoundActions(reducer)`

```ts
import { createStore } from "redux";
import { reduceCompoundActions } from "redoodle";
import { appStateReducer } from "./appStateReducer";

const store = createStore(reduceCompoundActions(appStateReducer));
```

#### Example: `compoundActionsEnhancer()`

```ts
import { createStore } from "redux";
import { compoundActionsEnhancer } from "redoodle";
import { appStateReducer } from "./appStateReducer";

const initialState = {...};
const store = createStore(appStateReducer, initialState, compoundActionsEnhancer());
```

For more about store enhancers, see the Redux [documentation](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#store-enhancer).

#### TypeScript definition

```ts
function reduceCompoundActions<S>(delegate: Reducer<S>): Reducer<S>;
function compoundActionsEnhancer(): StoreEnhancer;
```
