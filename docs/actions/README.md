# Typed Actions

When using Redux, programmers create Actions,
which are plain JavaScript objects with a type (string)
and associated data (usually a "payload").
For example, the following raw data is a Redux action:

```js
{ type: "chatroom::add_message",
  payload: {
    message: "Hello Redoodle",
    author: "crazytoucan"
  } }
```

All actions of a given type have well-defined matching payload shapes,
and we want our editor to tell us what's in the payload
when we see an action of type `"chatroom::add_message"`.
Using Redoodle TypedActions, the programmer can create a Definition to marry
the unique action string `"chatroom::add_message"` to the accompanying
payload data `{message: string, author: string}`.

Redoodle TypedActions are [FSA](https://github.com/acdlite/flux-standard-action)-compliant.

There are three basic steps to integrating TypedActions into your Redux-enabled application:

1. [Create Definitions for your actions](CreatingDefinition.md)
2. [Use Definitions to create your Actions](UsingDefinitionCreate.md)
3. [Reduce Actions using TypedReducers](UsingTypedReducer.md)

There are some additional tricks that Definitions give you:

* [Advanced: Identifiying Actions](UsingDefinitionIs.md)
