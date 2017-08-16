# `reduceCompoundActions(reducer)`

The `reduceCompoundActions` function wraps a delegate Reducer
to also handle CompoundActions (by reducing them in sequence).

See also the section on [Configuring your Store](/docs/compound/ConfiguringStore.md)
for usage with CompoundActions.

#### Example (configuring a Store)

```ts
import { createStore } from "redux";
import { reduceCompoundActions } from "redoodle";
import { appStateReducer } from "./appStateReducer";

const store = createStore(reduceCompoundActions(appStateReducer));
```

#### TypeScript definition

```ts
function reduceCompoundActions<S>(delegate: Reducer<S>): Reducer<S>;
```
