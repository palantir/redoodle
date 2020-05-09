# Compound Actions

Redoodle's CompoundAction builtin action type is a second-order action definition
that wraps an array of actions in its own payload.
Sub actions are executed in the order defined in the payload,
and the entire reduction is applied atomically in the Redux store.
An example compound action might look like the following:

```js
{
  type: "redoodle::compound",
  payload: [
    {
      type: "CreatePlaylist",
      payload: { playlistId: "100", name: "Focus Music" }
    },
    {
      type: "AddSongToPlaylist",
      payload: { songId: "7878", playlistId: "100" }
    },
    {
      type: "FlashPlaylist",
      payload: { playlistId: "100", color: "green" }
    }
  ]
}
```

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

    this.dispatch(CompoundAction([
      CreatePlaylist({ playlistId, name: playlistName }),
      AddSongToPlaylist({ songId, playlistId }),
      FlashPlaylist({ playlistId, color: "green" }),
    ]));
  }
}
```

#### TypeScript definition

```ts
const CompoundAction: TypedAction.Definition<"redoodle::compound", Action[]>;
```
