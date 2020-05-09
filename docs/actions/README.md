# Typed Actions

When using Redux, programmers create Actions,
which are plain JavaScript objects with a type (string)
and associated data (usually a "payload").
For example, the following raw data is a Redux action:

```js
{
  type: "AddMessage",
  payload: {
    message: "Hello Redoodle",
    author: "crazytoucan"
  }
}
```

All actions of a given type have well-defined matching payload shapes,
and we want our editor to tell us what's in the payload
when we see an action of type `"AddMessage"`.
Using Redoodle TypedActions, the programmer can create a Definition to marry
the unique action string `"AddMessage"` to the accompanying
payload data `{ message: string, author: string }`.

Redoodle TypedActions are [FSA](https://github.com/acdlite/flux-standard-action)-compliant.

There are two steps to integrating TypedActions into your Redux-enabled application:

1. [Create and use Definitions for your actions](UsingDefinitions.md)
3. [Reduce Actions using TypedReducers](UsingTypedReducer.md)
