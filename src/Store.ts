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

import { Dispatch } from "./Dispatch";
import { Reducer } from "./Reducer";
import { _ObservableLike } from "./_observableCompat";

/**
 * Standard Redux Store type.
 */
export interface Store<S> {
  [Symbol.observable](): _ObservableLike<S>;
  dispatch: Dispatch;
  getState: () => S;
  subscribe: (listener: () => void) => () => void;
  replaceReducer: (reducer: Reducer<S>) => void;
}
