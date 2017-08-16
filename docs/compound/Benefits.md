# Benefits of CompoundAction

By leveraging CompoundActions in the appropriate places,
applications can combine a set of fine-grained Actions to represent a higher-level operation,
instead of having to build "do-these-three-things" Actions in combinations manually.
This also helps Reducer writers, as there will be a smaller total domain of Actions to handle
with less duplicated code.

Furthermore, dispatching a CompoundAction has the following benefits compared to
dispatching each of the wrapped Actions individually:

- Actions are applied atomically, so a failed reduction of any of the Actions will
  leave the Redux State consistent.
- Only one store subscription event will be fired, after _all_ Actions have been reduced,
  instead of an event per Action.
  - No Store subscribe()rs will see inconsistent intermediate States during half-applied operations.
  - No wasted React update cycles after each incremental Action.
