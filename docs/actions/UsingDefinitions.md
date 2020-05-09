# Using TypedActionDefinitions

## Part 1: Creating a Definition

The first step to integrating TypedActions into your Redux application is
to create a Definition, which marries a unique Action type string
(like `"AddMessage"`) to the associated payload
(like `{ message: string, author: string }`).

> **Note**: The syntax for `defineAction` is just a little awkward, with the double sets of `()`.
> There is a good reason for the syntax choice, so just be careful not to forget all the pieces!
> Written in one line, the correct syntax is `defineAction("Foo")<FooPayload>()`.

The utility function [isType](../utilities/isType.md)
shows how to use a Definition as a type guard to detect Actions that match it.

#### Example

```ts
// actions.ts
import { defineAction } from "redoodle";

export const AddMessage = defineAction("AddMessage")<{
  message: string;
  author: string;
}>();

// ... all the other action definitions used by your app
```

#### TypeScript signature

```ts
function defineAction<E extends string>(type: E): <T = undefined>() => TypedActionDefinition2<E, T>;
```

## Part 2: Using Your Definitions

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
The following section [Reducing Actions](UsingTypedReducer.md) walks through
how to use the TypedReducer utility to create a Redux Reducer that leverages
the power of typed Action Definitions.

#### Example

```ts
import { AddMessage } from "./actions";

// assuming AddMessage is created using defineAction(), as in the above section:
//
// const AddMessage = defineAction("AddMessage")<{
//   message: string;
//   author: string;
// }>();
//

store.dispatch(
  AddMessage({
    message: "Hello Redoodle",
    author: "crazytoucan"
  }),
);

// The code above dispatches the following action to your store:
//
//   {
//     type: "AddMessage",
//     payload: {
//       message: "Hello Redoodle",
//       author: "crazytoucan"
//     }
//   }
//
// Most importantly, all of the fields of the generated `action` are type-aware at compile time.
// Using ~> to denote TypeScript type inferencing:
//
//    action.type ~> "AddMessage"    (the specific string literal)
//    action.payload ~> { message: string, author: string }
//    action.payload.message ~> string
//    action.payload.whoops ~> Error [ts] Property 'whoops' does not exist
```

#### TypeScript signature

```ts
type TypedActionDefinition2<E extends string, T> = {
    <M>(payload: T, meta?: M): {
        type: E;
        payload: T;
        meta: M;
    };

    TYPE: TypedActionString<T, E>;
    __PAYLOAD: T;
} & (T extends undefined ? {
    (): {
        type: E;
        payload: undefined;
    };
} : {});

```
