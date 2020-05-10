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

/**
 * Compose a sequence of reducers into a single effective Reducer,
 * applying the functions in the order given.
 *
 * For example, composeReducers(f, g, h) will yield the reducer
 * (state, action) => h(g(f(state, action), action), action).
 */
export function composeReducers<S>(...reducers: Reducer<S>[]): Reducer<S> {
  return (state: S, action: Action) => {
    let nextState = state;
    for (let i = 0; i < reducers.length; i++) {
      nextState = reducers[i](nextState, action);
    }

    return nextState;
  };
}
