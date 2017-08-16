# Compound Actions

Redoodle's CompoundAction builtin action type is a second-order action definition
that wraps an array of actions in its own payload.
Sub actions are executed in the order defined in the payload,
and the entire reduction is applied atomically in the Redux store.
An example compound action might look like the following:

```js
{ type: "redoodle::compound",
  payload: [
    { type: "musicplayer::create_playlist",
      payload: { playlistId: "100", name: "Focus Music" }
    },
    { type: "musicplayer::add_song_to_playlist",
      payload: { songId: "7878", playlistId: "100" }
    },
    { type: "musicplayer::flash_playlist",
      payload: { playlistId: "100", color: "green" }
    }
  ]
}
```

The CompoundAction type is a plain ol' `TypedAction.Definition`,
so CompoundActions can be created with the standard Definition method
`CompoundAction.create(Action[])`.

Don't forget to [Configure your Store](ConfiguringStore.md) for usage with CompoundActions!

#### Example

```ts
import { uniqueId } from "lodash";
import { compoundAction, Dispatch } from "redoodle";
import { CreatePlaylist, AddSongToPlaylist, FlashPlaylist } from "./actions";

class MusicPlayerActionCreator {
  private dispatch: Dispatch;
  constructor(dispatch: Dispatch) {
    this.dispatch = dispatch;
  }

  addSongToNewPlaylist(songId: string, playlistName: string) {
    let playlistId = uniqueId();

    this.dispatch(CompoundAction.create([
      CreatePlaylist.create({playlistId, name: playlistName}),
      AddSongToPlaylist.create({songId, playlistId}),
      FlashPlaylist.create({playlistId, color: "green"}),
    ]));
  }
}
```

#### TypeScript definition

```ts
const CompoundAction: TypedAction.Definition<"redoodle::compound", Action[]>;
```

```ts
// Rewritten as an equivalent namespace for readability:
namespace CompoundAction {
  function create(payload: Action[]): {type: "redoodle::compound"; payload: Action[];};
  function is(action: Action): action is TypedAction<Action[], "redoodle::compound">;
  const TYPE: TypedActionString<Action[], "redoodle::compound">;
}
```
