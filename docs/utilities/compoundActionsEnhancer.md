# `compoundActionsEnhancer()`

Creates a StoreEnhancer that additionally wires the store's Reducer
to properly handle CompoundActions by reducing each wrapped Action in sequence.

See also the section on [Configuring your Store](/docs/compound/ConfiguringStore.md)
for usage with CompoundActions.

For more about store enhancers, see the Redux [documentation](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#store-enhancer).

#### Example (configuring a Store)

```ts
import { createStore } from "redux";
import { compoundActionsEnhancer } from "redoodle";
import { appStateReducer } from "./appStateReducer";

const store = createStore(appStateReducer, compoundActionsEnhancer());
```


#### TypeScript definition

```ts
function compoundActionsEnhancer(): StoreEnhancer;
```
