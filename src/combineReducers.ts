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
import { Action } from "./Action";
import { Reducer } from "./Reducer";
import { ReducerMap } from "./ReducerMap";

const hasOwnProperty = Object.prototype.hasOwnProperty;

function reduce<S>(state: S, action: Action, reducerMap: ReducerMap<S>) {
  let newState: S | undefined = undefined;

  for (const key in reducerMap) {
    if (!hasOwnProperty.call(reducerMap, key)) {
      continue;
    }

    const statePart = state[key];
    const newStatePart = reducerMap[key](statePart, action);
    if (newStatePart !== statePart) {
      if (!newState) {
        newState = __assign(Object.create(Object.getPrototypeOf(state)), state) as S;
      }

      newState[key] = newStatePart;
    }
  }

  return newState !== undefined
      ? newState
      : state;
}

function verifySameShape<S>(state: S, reducerMap: ReducerMap<S>) {
  for (const key in state) {
    if (
      hasOwnProperty.call(state, key) &&
      !hasOwnProperty.call(reducerMap, key)
    ) {
      throw new Error(`mismatched shapes in combineReducers(): reducers missing '${key}'`);
    }
  }

  for (const key in reducerMap) {
    if (
      hasOwnProperty.call(reducerMap, key) &&
      !hasOwnProperty.call(state, key)
    ) {
      throw new Error(`mismatched shapes in combineReducers(): state missing '${key}'`);
    }
  }
}

/**
 * Turns an object whose values are different reducer functions into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * Remark: This function behaves almost the same as the redux builtin combineReducers,
 * except this version does not perform any initial undefined-state shape computation.
 * For more on initial state handling, consult the discussion in initialState.md.
 *
 * @template S Combined state object type.
 *
 * @param reducerMap An object whose values correspond to different reducer
 *   functions that need to be combined into one.
 *
 * @returns A reducer function that invokes every reducer inside the passed
 *   object, and builds a state object with the same shape.
 */
export function combineReducers<S>(reducerMap: ReducerMap<S>): Reducer<S> {
  let hasVerifiedShape = false;
  return (state: S, action: Action) => {
    if (
      typeof process === "undefined" ||
      process.env.NODE_ENV !== "production"
    ) {
      if (
        state === undefined ||
        state === null ||
        typeof state !== "object"
      ) {
        throw new Error("combineReducers() requires object state; received " + state);
      }

      if (!hasVerifiedShape) {
        verifySameShape(state, reducerMap);
        hasVerifiedShape = true;
      }
    }

    return reduce(state, action, reducerMap);
  };
}
