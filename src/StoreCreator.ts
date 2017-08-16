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

import { Reducer } from "./Reducer";
import { Store } from "./Store";

/**
 * A standard function type for creating Stores. The StoreCreator
 * type is used by StoreEnhancers, which allow code to decorate (modify)
 * the store creation chain with additional logic.
 *
 * This is typically used when creating custom middleware.
 *
 * Remark: This function deviates slightly from the Redux standard
 * StoreCreator type in that we _require_ initialState, where Redux
 * allows it to be optional. For more on initial state handling, see
 * the discussion in initialState.md.
 */
export interface StoreCreator<S> {
  (reducer: Reducer<S>, initialState: S): Store<S>;
}
