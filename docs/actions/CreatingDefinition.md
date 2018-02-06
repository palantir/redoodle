# Creating TypedAction Definitions

The first step to integrating TypedActions into your Redux application is
to create a Definition, which marries a unique Action type string
(like `"chatroom::add_message"`) to the associated payload
(like `{message: string, author: string}`).

> **Note**: The syntax for `TypedAction.define` is just a little awkward, with the double sets of `()`.
> There is a good reason for the syntax choice, so just be careful not to forget all the pieces!
> Written in one line, the correct syntax is `TypedAction.define("namespace::do_foo")<DoFooPayload>()`.

The following section [Creating Actions](UsingDefinitionCreate.md) walks through how
to use a new Definition to stamp Action instances.
The advanced section [Identifying Actions](UsingDefinitionIs.md)
shows how to use a Definition as a type guard to detect Actions that match it.

#### Example

```ts
import { TypedAction } from "redoodle";

export const AddMessage = TypedAction.define("chatroom::add_message")<{
  message: string;
  author: string;
}>();
```

#### TypeScript definition

```ts
export namespace TypedAction {
  function define<E extends string>(type: E):
      <T>() => Definition<E, T>;

  interface Definition<E extends string, T> {
    (payload: T): {type: E; payload: T;};
    create(payload: T): {type: E; payload: T;};
    is(action: Action): action is TypedAction<T, E>;
    TYPE: TypedActionString<T, E>;
  }
}
```
