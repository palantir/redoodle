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

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function shallowEqualsPartial(state: any, partial: any): boolean {
  const partialKeys = Object.keys(partial);
  for (let i = 0; i < partialKeys.length; i++) {
    const key = partialKeys[i];
    const partialValue = partial[key];
    if (
      state[key] !== partialValue ||
      (partialValue === undefined && !hasOwnProperty.call(state, key))
    ) {
      return false;
    }
  }

  return true;
}
