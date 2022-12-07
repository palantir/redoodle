## 2.7.0

- Add PayloadOf type to get payload from definitions
## 2.6.0

- Add barebones Observable support ([#55](https://github.com/palantir/redoodle/pull/56))
- Add type compatibility for Redux 4 for better out-of-the-box integration for libraries like React-redux ([#55])(https://github.com/palantir/redoodle/pull/56)

## 2.5.0

- **NOTICE**: TypeScript >= 3.0 required to use Redoodle starting with 2.5.0 ([#33](https://github.com/palantir/redoodle/pull/33))
- Add `defineAction()`, a faster alternative to `TypedAction.define()` ([#36](https://github.com/palantir/redoodle/pull/36))
- Add `isType()` helper for usage with definitions returned from `defineAction()` ([#36](https://github.com/palantir/redoodle/pull/36))
- Speed up internal code paths by using plain for loops instead of `for in` or `for of` ([#39](https://github.com/palantir/redoodle/pull/39))
- Remove internal usages of `delete` ([#39](https://github.com/palantir/redoodle/pull/39))
- Greatly simplify logging middleware, which should improve performance in development and improve download times for end application bundles that don't tree-shake ([#40](https://github.com/palantir/redoodle/pull/40)]
- Simplify prototype handling ([#42](https://github.com/palantir/redoodle/pull/42))
- [internal] Update to Circle 2 ([#31](https://github.com/palantir/redoodle/pull/31))
- [internal] Use Prettier for code formatting ([#41](https://github.com/palantir/redoodle/pull/41))

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
