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
import { Reducer } from "./Reducer";
import { TypedAction } from "./TypedAction";
import { TypedActionDefinition2 } from "./TypedActionDefinition2";
import { TypedActionString } from "./TypedActionString";
import { TypedReducerBuilderImpl } from "./internal/TypedReducerBuilderImpl";

/**
 * Important utility to help build Redux Reducer functions
 * when you have TypedActions available. In contrast to normal
 * reducer writing, the TypedReducer gives strong type inferencing
 * in each of your Action type branches.
 */
export namespace TypedReducer {
  /**
   * Builder interface for constructing Reducers using TypedActions.
   * Consumers should define their reducer using a sequence of `.withHandler()`,
   * `.withActionHandler()`, and `.withDefaultHandler()` before invoking `build()`.
   */
  export interface Builder<S> {
    /**
     * Most common builder method that associates a handler for
     * a given type of Action. This builder method will present the Action's
     * payload for the consumer.
     *
     * In practice, specific Action Reducers depend only on the associated payload,
     * and unwrapping that once allows for compact syntax for destructuring:
     *
     *
     * ```
     * const reducer = TypedReducer.builder<State>();
     *
     * reducer.withHandler(SetResultsAction.TYPE, (state, {results, areMoreAvailable}) => {
     *   return setWith(state, {results, areMoreAvailable});
     * });
     *
     * reducer.withHandler(ClearResultsAction.TYPE, (state, {id}) => {
     *   return setWith(state, {
     *     history: omit(state.history, id)
     *   });
     * });
     *
     * return reducer.build();
     * ```
     *
     *
     * It is an error to specify more than one handler for the same kind of action.
     */
    withHandler<T>(
      type: TypedActionString<T>,
      handler: (state: S, payload: T, meta: any | undefined) => S,
    ): this;

    /**
     * Alias for withHandler that takes the whole action definition rather than just the typ string.
     */
    withDefinitionHandler<T, E extends string>(
      type: TypedActionDefinition2<E, T> | TypedAction.Definition<E, T> | TypedAction.NoPayloadDefinition<E>,
      handler: (state: S, payload: T, meta: any | undefined) => S,
    ): this;

    /**
     * Similar to `.withHandler()`, but gives the raw Action itself (instead
     * of unwrapping the payload). Used often when building higher order reducers
     * that will ferry the action down to delegates or similar.
     *
     * It is an error to specify more than one handler for the same kind of action.
     */
    withActionHandler<T, E extends string = string>(
      type: TypedActionString<T, E>,
      handler: (state: S, action: TypedAction<T, E>) => S,
    ): this;

    /**
     * Optional fallback branch during reduction, which will pass the unhandled
     * action to the given handler. This "default" handler will not be invoked
     * if there was a handler supplied to `reducing()` or `reducingAction()`
     * for the `action`.
     *
     * It is an error to specify more than one `reducingDefault()` to the same Builder.
     */
    withDefaultHandler(handler: (state: S, action: Action) => S): this;

    /**
     * Returns the Reducer backed by all of the handlers defined on this Builder.
     * It is an error to re-use this Builder instance to create more Reducers.
     */
    build(): Reducer<S>;
  }

  /**
   * Returns a new instance of a TypedReducer.Builder.
   */
  export function builder<S>(): TypedReducer.Builder<S> {
    return new TypedReducerBuilderImpl<S>();
  }
}
