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

import { TypedActionString } from "./TypedActionString";

/**
 * A central type of Redoodle, the TypedAction2Definition2 manages all Redux Actions
 * of a specific type string, such as `"RemoveBar"`.
 *
 * - Definitions should be used to create Actions.
 * - Definitions can be used to identify an Action using its Definition.TYPE.
 *
 * All Definitions for a Redux-enabled application must have unique strings.
 */
export type TypedActionDefinition2<E extends string, T> = {
  /**
   * Creates an Action of this type with the given payload and meta.
   */
  <M>(payload: T, meta?: M): { type: E; payload: T; meta: M };

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
} & (T extends undefined
  ? {
      /**
       * When the action has no payload type, you can simply invoke the Definition with no args
       * to create the action `{ type: "Foo", payload: undefined }`
       */
    (): { type: E; payload: undefined };
  }
  : {});
