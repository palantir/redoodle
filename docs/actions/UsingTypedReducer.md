# Reducing Actions

_(...with type safety!)_

Redoodle packages a reducer-builder that plays nicely with typed action Definitions.
The basic usage is to build up handlers for each type of Action that your
reducer is going to respond to, and then build() the final reducer.

TypedReducers are created using a provided Builder to configure Handlers.
- A Handler can be assigned to a specific action type string to define
  how to reduce actions of that type against the state.
- If no Handler is specified for a given action, a default handler can be
  specified as a catch-all.
- If no matching handler is defined for an action AND there is no default handler,
  the reducer returns the input `state`.

This makes the TypedReducer semantics roughly equivalent to a `switch`,
with each handler a `case` and the fallback `default` (if provided).
Under the hood, a map by Action type is used to call the correct reducer branch in O(1) time.

**Note**: Redoodle's Reducer semantics differ very slightly from Redux's
in regards to initial State handling. In short, Redoodle Reducer's actually
_aren't_ expected to respond to `undefined`, although this can cause initial
integration problems to an existing Redux application. For more,
please check out the [Initial State Management](/docs/InitialState.md) section.

#### Example

```ts
import { TypedReducer, setWith } from "redoodle";
import { AddMessage, ClearHistory } from "./actions";

export interface ChatroomState {
  messages: string[];
}

function createReducer() {
  export const builder = TypedReducer.builder<ChatroomState>()

  builder.withHandler(AddMessage.TYPE, (state, payload) => {
    // `payload` is recognized as {message, author} due to type information
    // carried around in AddMessage.TYPE. No need to explicitly cast anything
    // here, as the compiler can infer everything.
    return setWith(state, {
      messages: [...state.messages, payload.message]
    });
  });

  builder.withHandler(ClearHistory.TYPE, (state) => {
    return setWith(state, {
      messages: []
    });
  });

  builder.withDefaultHandler(state => {
    // Note: this example matches Redux behavior requirements for initial state
    // handling. Redoodle takes an opinionated stand against default Redux initial
    // state management, as discussed in the Initial State Management section of the docs.
    return state !== undefined ? state : INITIAL_STATE;
  });

  return builder.build();
}

// The final `reducer` is a plain Reducer<ChatroomState>
const reducer = createReducer();
```

> **Note**: The builder supports a streaming style as shown below,
> but the amount of indentation may make the code harder to maintain. YMMV.
>
> ```ts
> TypedReducer.builder<T>()
>     .withHandler(...)
>     .withHandler(...)
>     .withDefaultHandler(...)
>     .build()
> ```
>

#### TypeScript definition

```ts
namespace TypedReducer {
  interface Builder<S> {
    withHandler<T>(
      type: TypedActionString<T>,
      handler: (state: S, payload: T, meta: any | undefined) => S,
    ): this;

    withActionHandler<T, E extends string = string>(
      type: TypedActionString<T, E>,
      handler: (state: S, action: TypedAction<T, E>) => S,
    ): this;

    withDefaultHandler(
      handler: (state: S, action: Action) => S,
    ): this;

    build(): Reducer<S>;
  }
}
```
