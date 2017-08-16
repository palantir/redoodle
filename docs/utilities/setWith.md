# `setWith(state, ...overrides)`

Offered as a utility for applying state updates, `setWith` is kind of like `Object.assign`,
except that its behavior has been fine-tuned for use when writing Reducers.
The notable differences from stock `Object.assign` are that:

1. This function may return its first argument `state` if the functional result
    would otherwise shallow-equal `state`. This is important to Redux workflows
    that don't want to create unnecessary copies.
2. The TypeScript typing of this function is more specific to the state-update workflow:
    for state objects that have no index signature,
    overrides must be a Partial of the state's type. This makes usages of `setWith`
    more resilient than plain `assign` to naming refactors, for instance.
3. This function must be called with at least two arguments, as otherwise
    `setWith(obj) === obj` always.
4. This function is careful about prototype-handling, and will return an object without
    a prototype if the input `state` has no prototype.
5. The always-empty first arg is omitted.


#### Example

```ts
import { TypedReducer, setWith as sw } from "redoodle";
import { AppState } from "./AppState";
import { SetStatus } from "./actions/SetStatus";

const reducer = TypedReducer.builder<AppState>();

// Applies the deeply nested copy-on-write `state.statuses[payload.name] = payload.status.
// If the old status and the new end up being the same, this entire handler is a no-op.
// Each of the assignments are type-safe.
reducer.addHandler(SetStatus.TYPE, (state, payload) => {
  return sw(state, {
    statuses: sw(state.statuses, {
      [payload.name]: payload.status
    });
  });
});
```

If the input `state` to `setWith` is unmodified by the operation (that is, it's shallow-equal to its old value),
the same `state` reference itself is returned by `setWith()` to encourage reference equality between state updates.


#### TypeScript definition

```ts
function setWith<S, K extends keyof S>(
  state: S,
  override: (Partial<S> & Pick<S, K>),
  ...addlOverrides: (Partial<S> & Pick<S, K>)[],
): S;

function setWith<S extends Record<string, any>>(
  state: S,
  override: S,
  ...addlOverrides: S[],
): S;
```
