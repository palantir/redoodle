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

import { TypedActionDefinition2 } from "./TypedActionDefinition2";

/**
 * A central concept to Redoodle, a TypedAction is a stricter flavor of
 * Action that associates a specific Action type string with a matching payload.
 *
 * To use TypedActions:
 *
 * 1. Create a Definition using `defineAction()`. For example,
 *
 *    ```
 *    export const RemoveBar = defineAction("RemoveBar")<{ bar: string }>();
 *    ```
 *
 * 2. Use the Definition wherever you need to create conformant actions. For example,
 *
 *    ```
 *    store.dispatch(RemoveBar({ bar: "three" }));
 *    // dispatches the action `{ type: "RemoveBar", payload: { bar: "three" } }`
 *    ```
 *
 * Conforms to Flux Standard Action recommendations.
 *
 * @param type the action type string
 */
export function defineAction<E extends string>(type: E) {
  return <T = undefined>(): TypedActionDefinition2<E, T> => {
    const retval: TypedActionDefinition2<E, T> = function (
      payload: T,
      meta: any,
    ) {
      return arguments.length === 3
        ? { type, payload, meta }
        : { type, payload };
    } as any;

    retval.TYPE = type as any;
    return retval;
  };
}
