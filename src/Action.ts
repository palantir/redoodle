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

/**
 * Basic Redux action type.
 *
 * This type is purposefully unopinionated and minimal for describing the broad
 * Reducer and Dispatch APIs. In practice, consumers of Redoodle will be creating
 * TypedActionDefs that yield the far more expressive TypedAction.
 *
 * @see Dispatch
 * @see Reducer
 * @see TypedAction
 */
export interface Action {
  type: any;
  [name: string]: any;
}
