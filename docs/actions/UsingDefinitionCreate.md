# Creating TypedActions

The most important thing a Definition does is to be a factory to stamp
instances of Actions that conform to the Definition.

A Definition is a callable function which, given a payload,
will create an Action object ready to dispatch.
The Definition itself is typesafe, which means that a payload
that has incorrect, has extra, or is missing keys will raise compile-time errors.

The created Action is a plain old Redux Action that's ready to go straight
to a Store's `dispatch()`.
While this could be the end of the story for Redoodle, Redoodle also provides
powerful utilities for reducing Actions based on Definitions.
The following section [Reducing Actions](UsingTypedReducer) walks through
how to use the TypedReducer utility to create a Redux Reducer that leverages
the power of typed Action Definitions.

#### Example

```ts
import { TypedAction } from "redoodle";

// From a previous section, "Creating Definitions"
const AddMessage = TypedAction.define("chatroom::add_message")<{
  message: string;
  author: string;
}>();

const action = AddMessage({
  message: "Hello Redoodle",
  author: "crazytoucan"
});

// At runtime, `action` is the plain object
//
//    { type: "chatroom::add_message",
//      payload: {
//        message: "Hello Redoodle",
//        author: "crazytoucan"
//      } }
//
// Most importantly, all of the fields of `action` are type-aware at compile time.
// Using ~> to denote TypeScript type inferencing:
//
//    action.type ~> "chatroom::set_message"    (the specific string literal)
//    action.payload ~> {message: string, author: string}
//    action.payload.message ~> string
//    action.payload.whoops ~> Error [ts] Property 'whoops' does not exist
```

#### TypeScript definition

```ts
namespace TypedAction {
  interface Definition<E extends string, T> {
    (payload: T): {type: E; payload: T;};

    // other members not explored in this segment
    create(payload: T): {type: E; payload: T;};
    is(action: Action): action is TypedAction<T, E>;
    TYPE: TypedActionString<T, E>;
  }
}
```
