# Initial State Handling

Redoodle's stance on initial State handling differs from core Redux's.
This section of the documentation discusses the practical changes to usage,
as well as the motivations behind the change.

The Redux opinions on State initialization (e.g. `undefined` in Reducers) are good.
As a refresher, the documentation at http://redux.js.org/docs/recipes/reducers/InitializingState.html
cites the behavior that Redux expects.
The discussion at https://github.com/reactjs/redux/issues/514#issuecomment-131209218
gives a reasonable rundown of the motivations for that behavior.

In short, Redux cites the truth that keeping a matching State shape and the accompanying Reducer shape
in sync with each other is challenging if they are in separate files on disk in JavaScript.


## Differences

Redoodle believes that it is never the job of a Reducer to compute initial State.

- Redoodle Reducers are never expected to accept `undefined` as a flag to compute initial State.
   This makes a `Reducer<S>` truly a `Reducer<S>`, and not a function `(S | undefined, Action) => S`.
- As a result, the owning Store is _always_ expected to be given complete initial State.


## Motivation

There are at least four ways that TypeScript itself interacts with the Redux decision
that are worth discussing in more detail:

1. In TypeScript, declaring a State type `S` and a `Reducer<S>` in different files
   yields predictable compiler errors when they get out of sync.
   This removes a lot of the initial Redux motivation for their Reducer behavior.
2. Following Redux's requirements makes typing our own Reducers significantly more painful,
   as Reducers would be required to implement the signature `<S>(S | undefined, Action) => S`
   instead of the more natural `<S>(S, Action) => S`.
3. Building up a monolithic State object for the entire application from many smaller pieces
   is aided greatly by the TypeScript compiler.
   It isn't nearly as hard as it used to be in JavaScript to modularize each of the pieces of State
   into different scattered files around a repository
   and then combine them together at Store creation time for completeness.
4. In the presence of strong tools that help spot other inconsistencies at compile time,
   programming loosely around whether a Reducer properly handled initial State internally
   caused more problems than it eased development.

On the fuzzier side, we've seen many Reducers in the wild have no idea what their true "initial state" is.
For example, most of our applications are seeded with data from a server that is bootstrapped before the Redux Store is live;
similarly, Reducers may operate on a smaller piece of state that is actually created by some smarter/grander piece of the system.
We've found that allowing Reducers to truly be a pure function of State and Actions aids maintainability
by decoupling those Reducers from subtle state management.

For the reasons above, I hope you can forgive our divergence and the occasional pain that it can cause
when initially integrating Redoodle into your Redux application.


## In practice

- When you are creating your Store, be sure to define your initial State!
- If you are using `TypedReducer` and you want to maintain compatibility with an existing Redux application,
  consider adding a `handleDefault()` block to respond to Redux `undefined` initialization.
- If you are using Redux's `combineReducers()` and you are getting errors about incorrect shape management,
  consider using the version of `combineReducers()` packaged with Redoodle, which is otherwise 100% compatible
  but isn't opinionated about `undefined` handling.

Over time, we really do recommend that consumers migrate away from the Redux `undefined` initialization code paths,
in favor of explicit initial State construction.
