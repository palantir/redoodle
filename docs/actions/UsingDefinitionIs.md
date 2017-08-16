# Using a Definition to identify Actions

Definitions can identify a plain Redux Action as one of its members using the `Definition.is()` method.

> While `Definition.is()` would be handy for writing Reducers too,
> the TypedReducer class is much better suited for the job.


#### Example

```ts
import { TypedAction } from "redoodle";

const action: Action = receiveActionFromServer();

// From a previous section, "Creating Definitions."
const AddMessage = TypedAction.define("chatroom::add_message")<{
  message: string;
  author: string;
}>();

if (AddMessage.is(action)) {
  // AddMessage.is() is a TypeScript type guard, which narrows
  // the plain Action object into the much more explicit typing
  //
  //    action ~> {
  //      type: "chatroom::set_message",
  //      payload: {
  //        message: string;
  //        author: string;
  //      }
  //    }
  //
  console.log(`${action.author}: ${action.message}`);
}
```

#### TypeScript definition

```ts
namespace TypedAction {
  interface Definition<E extends string, T> {
    is(action: Action): action is TypedAction<T, E>;
  }
}
```

```ts
interface TypedAction<T, E extends string> {
  type: E;
  payload: T;
  meta?: any;
}
```
