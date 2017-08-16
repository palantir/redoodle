# `omit(state, keys)`

The Redoodle `omit` utility is useful when writing Reducers, and will return a (shallow) copy of an object with
some specified set of keys removed.
This is quite similar to `Lodash.omit`, except that it doesn't handle deeply nested updates like `foo.items[4].phase`.

If the input `state` to `omit` is unmodified by the operation (that is, it had none of the requested keys to omit),
the same state reference itself is returned by `omit()` to support reference equality between state updates.


#### Example

```ts
import {omit, setWith} from "redoodle";

reducer.withHandler(RemoveThing.TYPE, (state, payload) => {
  return setWith(state, {
    thingStates: omit(state.thingStates, [payload.id])
  });
});
```


#### TypeScript definition

```ts
function omit<S extends {[key: string]: any}>(state: S, keys: (keyof S)[]): S;
```
