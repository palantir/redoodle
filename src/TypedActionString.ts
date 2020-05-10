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
 * A branded string to associate an Action type string with
 * an Action payload shape.
 *
 * You should never create a TypedActionString directly: a TypedActionString
 * is owned by a TypedAction.Definition, created using `TypedAction.define()`.
 *
 * At runtime, instances of TypedActionString are really just raw strings.
 * The "branding" pattern (__type__) used here is a compiler trick to provide
 * type inferencing, effectively giving Redoodle the ability to check compile-time
 * correctness between the type and payload of an Action in e.g. TypedReducers.
 *
 * TypedActionStrings must be unique within an application: all Actions of a
 * given type must have consistent payload shapes as required by their Definition.
 */
export type TypedActionString<T, E extends string = string> = E & {
  __type__: {
    name: "redoodle/TypedActionString";
    withPayload: T;
  };
};
