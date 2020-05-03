/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Action } from "./Action";
import { TypedActionString } from "./TypedActionString";

/**
 * A central concept to Redoodle, a TypedAction is a stricter flavor of
 * Action that associates a specific Action type string with a matching payload.
 *
 * To use TypedActions:
 *
 * 1. Create a Definition, usually through `TypedAction.define()`. For example,
 *
 *    ```
 *    export const RemoveBarAction = TypedAction.define("myapp::remove_bar")<{bar: string}>();
 *    ```
 *
 * 2. Create an Action through `Definition.create()`. For example,
 *
 *    ```
 *    const action = RemoveBarAction.create({bar: "three"});
 *    ```
 *
 *
 * 3. Dispatch the action as usual, e.g. to a Redux `Store.dispatch`.
 *
 * The true benefit of TypedActions come on the Reducer-side. See
 * the TypedReducer class for more on creating a TypedAction-savvy Reducer for Redux.
 *
 * Conforms to Flux Standard Action recommendations.
 *
 * @see TypedActionDef#create
 */
export interface TypedAction<T, E extends string = string> {
  /**
   * The type string of the action, used to uniquely identify the Action with its Definition.
   *
   * The TypeScript typing of this value is refined to the actual string given to `TypedAction.define()`.
   */
  type: E;

  /**
   * The payload associated with the action, whose shape is dictated by the Definition
   * that generated this action. As allowed by the payload restrictions chosen by the consumer,
   * this payload could possibly be `undefined` or `null`.
   *
   * N.B. A NoPayloadDefinition doesn't actually define this key for generated actions, so such
   * actions are usually just `{type: "..."}`.
   */
  payload: T;

  /**
   * Optional metadata assigned to this action, which has no restrictions.
   * Interesting usages of metadata:
   *
   * 1. To add a timestamp for when the action was first created.
   * 1. To correlate a set of actions behind a single user event (such as a clickId).
   * 1. To track progression of an async task, such as a {loading => success} or {loading => error} set.
   * 1. To identify which actions are being triggered by a continually running job.
   *
   */
  meta?: any;
}

export namespace TypedAction {

  /**
   * Options to TypedAction.define().
   */
  export interface DefineOptions<T> {
    /**
     * A function used to validate the (runtime) correctness of payloads attached to a Definition's
     * actions. This can be useful to track down a noncompliant _source_ of actions,
     * as otherwise debugging where incorrect actions are coming from on the Reducer side can be challenging.
     *
     * Not run in production.
     */
    validate?: (payload: T) => boolean;
  }

  /**
   * One of the core functions of Redoodle, `TypedAction.define` creates a Definition
   * to manage all Redux actions of a specific type string, such as `"myapp::set_foo_value"`.
   *
   * Each Definition also associates a payload type `T` for all of its matching actions.
   * For example, the `"myapp::set_foo_value"` Action can associate a required payload shape
   * `{foo: string, value: number}`, which means that all actions in the application
   * with type `"myapp::set_foo_value"` *must* have payloads with a `foo` and a `value`.
   *
   * The syntax for invoking the function is slightly awkward, in favor of more predictable type inferencing.
   * An example invocation is below; note the extra `()` after the payload type declaration in `<{}>`s.
   *
   *
   * ```
   * export const SetFooValueAction = TypedAction.define("myapp::set_foo_value")<{
   *   foo: string;
   *   value: number;
   * }>();
   * ```
   *
   *
   * All Definitions for a Redux-enabled application MUST have unique strings.
   *
   * @param options.validatePayload
   */
  export function define<E extends string>(type: E): <T>(options?: DefineOptions<T>) => Definition<E, T> {
    return <T>(options?: DefineOptions<T>) => {
      if (process.env.NODE_ENV !== "production" && options !== undefined && options.validate !== undefined) {
        return createDefinitionWithValidator<E, T>(type, options.validate);
      } else {
        return createDefinition<E, T>(type);
      }
    };
  }

  /**
   * Similar to TypedAction.define, creates a NoPayloadDefinition for the given Action type
   * string, like `"example::clear_foo"`. In practice, actions without payloads are
   * usually of the "clear" or "invalidate" variety.
   *
   * The syntax for invoking the function is slightly awkward, in favor of more predictable type inferencing.
   * An example invocation is below; note the extra pair of `()`, for consistency with its sibling `define`
   * function and for better future-compatibility of options.
   *
   *
   * ```
   * export const SetFooValueAction = TypedAction.defineWithoutPayload("myapp::set_foo_value")();
   * ```
   *
   *
   * All Definitions for a Redux-enabled application MUST have unique strings.
   */
  export function defineWithoutPayload<E extends string>(type: E): () => NoPayloadDefinition<E> {
    return () => {
      return createNoPayloadDefinition<E>(type);
    };
  }

  /**
   * A central type of Redoodle, the TypedAction.Definition manages all Redux Actions
   * of a specific type string, such as `"myapp::set_foo_value"`.
   *
   * - Definitions should be used to create Actions.
   * - Definitions can be used to identify an Action, based on its own `type`.
   *
   * All Definitions for a Redux-enabled application MUST have unique strings.
   */
  export interface Definition<E extends string, T> {
    /**
     * Creates an Action of this type with the given payload.
     * Functionally equivalent to the explicit Definition.create().
     */
    (payload: T): {type: E, payload: T};

    /**
     * The Type of a TypedAction refers to the physical `{type}` string
     * given to matching Actions. This TypedActionString is branded
     * with the payload type as well for e.g. TypedReducer type inferencing.
     */
    TYPE: TypedActionString<T, E>;

    /**
     * Hidden field used for some workflows that need to extract the payload type back out of
     * a TypedAction definition. For example, `const payload: typeof MyAction.__PAYLOAD = { ... };`
     * can be used to define a payload conforming to MyAction.
     *
     * This value should only be used for constructing Types in TypeScript. It never holds a real value.
     * Future versions of Redoodle may throw when attempting accessing this value at runtime
     * to catch accidental misuse.
     */
    __PAYLOAD: T;

    /**
     * Creates an Action of this type with the given payload.
     */
    create(payload: T): {type: E, payload: T};

    /**
     * Creates an Action of this type with the given payload and meta.
     */
    createWithMeta<M>(payload: T, meta: M): {type: E, payload: T, meta: M};

    /**
     * Checks whether the given Action matches this Definition, based on its own `type`.
     * If so, we can safely narrow the Action's payload type based on this Definition.
     *
     * While this function can be used for action identification while Reducing,
     * TypedReducers provide much stronger utilities when working with TypedActions.
     */
    is(action: Action): action is TypedAction<T, E>;
  }

  export type PayloadOf<D extends Definition<any, any>> = D["TYPE"]["__type__"]["withPayload"];

  /**
   * A TypedAction.NoPayloadDefinition manages all Redux actions of a specific type string,
   * such as `"myapp::clear_foo"`. Unlike the sibling TypedAction.Definition,
   * actions matching this Definition are associated with no payload data. In practice,
   * actions without payloads are usually of the "clear" or "invalidate" variety.
   *
   * - Definitions should be used to create Actions.
   * - Definitions can be used to identify an Action, based on its own `type`.
   *
   * All Definitions for a Redux-enabled application MUST have unique strings.
   */
  export interface NoPayloadDefinition<E extends string> {
    /**
     * Creates an Action of this type (and no payload).
     * Functionally equivalent to the explicit NoPayloadDefinition.create().
     */
    (): {type: E, payload: never};

    /**
     * The Type of a TypedAction refers to the physical `{type}` string
     * given to matching Actions. This TypedActionString is branded
     * with the payload type as well for e.g. TypedReducer type inferencing.
     */
    TYPE: TypedActionString<never, E>;

    /**
     * Creates an Action of this type (and no payload).
     */
    create(): {type: E, payload: never};

    /**
     * Creates an Action of this type with the given meta (and no payload).
     */
    createWithMeta<M>(meta: M): {type: E, payload: never, meta: M};

    /**
     * Checks whether the given Action matches this Definition, based on its own `type`.
     * If so, we can safely narrow the Action's payload type based on this Definition.
     *
     * While this function can be used for action identification while Reducing,
     * TypedReducers provide much stronger utilities when working with TypedActions.
     */
    is(action: Action): action is TypedAction<never, E>;
  }

  function createDefinition<E extends string, T>(type: E): Definition<E, T> {
    const create = (payload: T): {type: E, payload: T} => {
      return {type, payload};
    };

    const createWithMeta = <M>(payload: T, meta: M): {type: E, payload: T, meta: M} => {
      return {type, payload, meta};
    };

    const is = (action: Action): action is TypedAction<T, E> => {
      return action.type === type;
    };

    const def = create as Definition<E, T>;
    def.create = create;
    def.createWithMeta = createWithMeta;
    def.is = is;
    def.TYPE = type as TypedActionString<T, E>;

    return def;
  }

  function createDefinitionWithValidator<E extends string, T>(
    type: E,
    validate: (payload: T) => boolean,
  ): Definition<E, T> {
    const create = (payload: T): {type: E, payload: T} => {
      if (!validate(payload)) {
        throw new Error(`'${type}' validation failed`);
      }

      return {type, payload};
    };

    const createWithMeta = <M>(payload: T, meta: M): {type: E, payload: T, meta: M} => {
      if (!validate(payload)) {
        throw new Error(`'${type}' validation failed`);
      }

      return {type, payload, meta};
    };

    const is = (action: Action): action is TypedAction<T, E> => {
      return action.type === type;
    };

    const def = create as Definition<E, T>;
    def.create = create;
    def.createWithMeta = createWithMeta;
    def.is = is;
    def.TYPE = type as TypedActionString<T, E>;

    return def;
  }

  function createNoPayloadDefinition<E extends string>(type: E): NoPayloadDefinition<E> {
    const create = (): {type: E, payload: never} => {
      return {type} as {type: E, payload: never};
    };

    const createWithMeta = <M>(meta: M): {type: E, payload: never, meta: M} => {
      return {type, meta} as {type: E, payload: never, meta: M};
    };

    const is = (action: Action): action is TypedAction<never, E> => {
      return action.type === type;
    };

    const def = create as NoPayloadDefinition<E>;
    def.create = create;
    def.createWithMeta = createWithMeta;
    def.is = is;
    def.TYPE = type as TypedActionString<never, E>;

    return def;
  }
}
