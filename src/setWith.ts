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

import { __assign } from "tslib";
import { shallowEqualsPartial } from "./internal/utils/shallowEqualsPartial";

/**
 * This overload is curated for overriding specific keys in an object with a well-known shape.
 *
 * Offered as a utility for applying state updates, the result
 * of `setWith` is essentially equivalent to `Object.assign({}, state, ...overrides)`.
 * Its behavior has been fine-tuned for use when writing Reducers.
 * The notable differences from stock `Object.assign` are that:
 *
 *  1. This function may return its first argument `state` if the functional result
 *      would otherwise shallow-equal `state`. This is important to Redux workflows
 *      that don't want to create unnecessary copies.
 *  2. The TypeScript typing of this method is more specific to the state-update workflow:
 *      for state objects that have no index signature,
 *      overrides must be a Partial of the state's type. This makes usages of `setWith`
 *      more resilient than plain `assign` to naming refactors, for instance.
 *  3. This function must be called with at least two arguments, as otherwise
 *      `setWith(obj) === obj` always.
 *  4. This function is careful about prototype handling, and will return an object without
 *      a prototype if the input `state` has no prototype.
 *
 * @param state the rigid state object to update. The object will not be modified.
 * @param override a partial update to apply to `state`.
 * @param addlOverrides additional overrides to apply to `state`.
 */
export function setWith<S, K extends keyof S>(
  state: S,
  override: (Pick<S, K> | S),
  ...addlOverrides: (Pick<S, K> | S)[],
): S;

/**
 * This overload is curated for overriding arbitrary keys in a Record.
 *
 * Offered as a utility for applying state updates, the result
 * of `setWith` is essentially equivalent to `Object.assign({}, state, ...overrides)`.
 * Its behavior has been fine-tuned for use when writing Reducers.
 * The notable differences from stock `Object.assign` are that:
 *
 *  1. This function may return its first argument `state` if the functional result
 *      would otherwise shallow-equal `state`. This is important to Redux workflows
 *      that don't want to create unnecessary copies.
 *  2. The TypeScript typing of this method is more specific to the state-update workflow:
 *      for state objects that have no index signature,
 *      overrides must be a Partial of the state's type. This makes usages of `setWith`
 *      more resilient than plain `assign` to naming refactors, for instance.
 *  3. This function must be called with at least two arguments, as otherwise
 *      `setWith(obj) === obj` always.
 *  4. This function is careful about prototype handling, and will return an object without
 *      a prototype if the input `state` has no prototype.
 *
 * @param state the Record to update. The object will not be modified.
 * @param override a set of key-values to apply to `state`.
 * @param addlOverrides additional overrides to apply to `state`.
 */
export function setWith<S extends Record<string, any>>(
  state: S,
  override: S,
  ...addlOverrides: S[],
): S;

export function setWith(state: any, ...overrides: any[]) {
  if (overrides.length === 1) {
    if (shallowEqualsPartial(state, overrides[0])) {
      return state;
    } else {
      return __assign(Object.create(Object.getPrototypeOf(state)), state, overrides[0]);
    }
  } else {
    const result = __assign(Object.create(Object.getPrototypeOf(state)), state, ...overrides);
    return shallowEqualsPartial(state, result) ? state : result;
  }
}
