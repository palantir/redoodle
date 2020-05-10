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
import { CompoundAction } from "./CompoundAction";
import { Reducer } from "./Reducer";

/**
 * Utility function to unwrap incoming CompoundActions to
 * the delegate reducer. Normal actions are also passed-through
 * transparently.
 *
 * @see compoundActionsEnhancer
 * @see CompoundAction
 */
export function reduceCompoundActions<S>(delegate: Reducer<S>): Reducer<S> {
  const compoundReducer = (state: S, action: Action): S => {
    if (CompoundAction.is(action)) {
      return action.payload.reduce(compoundReducer, state);
    } else {
      return delegate(state, action);
    }
  };

  return compoundReducer;
}
