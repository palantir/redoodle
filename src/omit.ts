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

const hasOwnProperty = Object.prototype.hasOwnProperty;

function anyDefined(state: any, keys: string[]): boolean {
  for (const key of keys) {
    if (hasOwnProperty.call(state, key)) {
      return true;
    }
  }

  return false;
}

/**
 * Offered as a utility for applying state updates, `omit` will return
 * a copy of the given object with specified keys removed. Unlike `lodash.omit`:
 *
 *  1. This `omit` does not apply deep updates, like `items[0].title`.
 *  2. If no keys in `keys` exist in the given state object, no copy is made
 *      and the `state` object itself is returned. This is important to Redux workflows
 *      that don't want to create unnecessary copies.
 *  4. This function is careful about prototype handling, and will return an object without
 *      a prototype if the input `state` has no prototype.
 */
export function omit<S extends {[key: string]: any}>(state: S, keys: (keyof S)[]): S {
  if (!anyDefined(state, keys as string[])) {
    return state;
  }

  const result = __assign(Object.create(Object.getPrototypeOf(state)), state);
  for (const key of keys) {
    delete result[key];
  }

  return result;
}
