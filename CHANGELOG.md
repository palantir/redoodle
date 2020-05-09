## 2.4.0

- Add `"sideEffects": false` to package.json ([#25](https://github.com/palantir/redoodle/pull/25))
- Add `TypedAction.__PAYLOAD` type helper ([#26](https://github.com/palantir/redoodle/pull/26))

## 2.3.2

- Use `Pick<S, K> | S` instead of `Pick<S, K> & Partial<S>` for `setWith()` typing.

## 2.3.1

- Allow TypedAction.Definitions and family to be called as functions
  as sugar for TypedAction.Definition.create(). ([#7](https://github.com/palantir/redoodle/pull/7))
- Add TypedAction.PayloadOf<> helper. ([#8](https://github.com/palantir/redoodle/pull/8))

## 2.2.1

- Bind Definition create() functions for use e.g. with `bindActionCreators`. ([#1](https://github.com/palantir/redoodle/pull/1) by @invliD)

## 2.2.0

- Open source.

## 2.1.0

- Add `createStore` for completeness.

## 2.0.0

- **[Breaking]** TypedActionDef.create() has moved to TypedAction.define().
  - TypedAction.define() has a slightly more awkward syntax than the old
    TypedActionDef.create(), specifically to surface the exact action
    string in the generated TypedAction typing. The motivation for this change
    was to call out the generated action type strings in editors
    for transparency and familiarity.
  - TypedActionDef has been removed.
  - Add TypedAction.Definition and TypedAction.NoPayloadDefinition.
- **[Breaking]** Remove deprecated API from before TypedAction.Definition was hardened.
  - Remove ActionTypeString.create().
  - Remove TypedActionFactory.
  - Remove TypedAction.create().
  - Remove TypedAction.is().
- **[Breaking]** Rename ActionTypeString => TypedActionString for consistency.
- **[Breaking]** CompoundAction's type string has changed from `redoodle/COMPOUND` to `redoodle::compound`.
  - This change should be transparent to consumers, as long as they aren't mixing versions of Redoodle.
- Add another (optional) generic arg to TypedAction and TypedActionString.
- Loosen generic Action type for consistency with Redux.
- Update action string constant naming scheme recommendations.
  - Motivation was to keep `ANGRY_STRINGS` out of logs and console messages,
    and to better decouple file system structure from action namespaces.
    The `::` sequence is reminiscent of C++ namespaces.

## 1.1.0

- Add `omit`.
- Add `setWith`.

## 1.0.0

- **[Breaking]** Remove ScopedAction. We've seen some usage, but it still doesn't seem crisp.
- **[Breaking]** Harden initialState handling.
- **[Breaking]** Renamed ActionCreator to ActionFactory to deconflict the Redux notion of a true ActionCreator.
- Added ActionTypeDef, which encapsulates a set of {TYPE, create(), is()}.
- Added ActionType.create() and ActionFactory.create().
- Improved some ergonomics w.r.t. createActionType() and createActionCreator().
- Use TS2.1 spread instead of Object.assign internally.
- Reorganize package structure for discoverability.
