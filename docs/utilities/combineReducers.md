# `combineReducers(reducers)`

Redoodle packages a version of `combineReducers` that isn't opinionated about initial `undefined` state handling.

**Note**: Redoodle's Reducer semantics differ very slightly from Redux's
in regards to initial State handling. In short, Redoodle Reducer's actually
_aren't_ expected to respond to `undefined`, although this can cause initial
integration problems to an existing Redux application. For more,
please check out the [Initial State Management](/docs/InitialState.md) section.

#### Example

```ts
import { combineReducers } from "redoodle";
import { playlistsReducer, PlaylistsState } from "./reducers/playlists";
import { preferencesReducer, PreferencesState } from "./reducers/preferences";

export interface AppState {
  playlists: PlaylistsState;
  preferences: PreferencesState;
}

export const reducer = combineReducers<AppState>({
  playlists: playlistsReducer,
  preferences: preferencesReducer,
});
```


#### TypeScript definition

```ts
function combineReducers<S>(reducerMap: ReducerMap<S>): Reducer<S>
```

```ts
interface ReducerMap<S> {
  [key in keyof S]: Reducer<S[key]>;
};
```
