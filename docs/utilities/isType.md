# Using a Definition to identify Actions

You can use the `isType()` helper method
Definitions can identify a plain Redux Action as one of its members using the `Definition.is()` method.

> While `Definition.is()` would be handy for writing Reducers too,
> the TypedReducer class is much better suited for the job.


#### Example

```ts
import { isType } from "redoodle";
import { AddMessage } from "./actions";

// assuming AddMessage is created using defineAction(), as in the section "Using Definitions":
//
// const AddMessage = defineAction("AddMessage")<{
//   message: string;
//   author: string;
// }>();
//

const action: Action = yield receiveActionFromServer();

if (isType(action, AddMessage.TYPE)) {
  // isType() is a TypeScript type guard, which narrows
  // the plain Action object into the much more explicit typing
  //
  //    action ~> {
  //      type: "AddMessage",
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
function isType<T>(action: Action, type: TypedActionString<T>): action is TypedAction<T>;
```
