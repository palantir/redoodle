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

import { Action, TypedAction, composeReducers } from "../index";

function add(state: number, action: TypedAction<number>) {
  return state + action.payload;
}

function multiply(state: number, action: TypedAction<number>) {
  return state * action.payload;
}

function constant(payload: number): Action {
  return {type: "test::constant", payload};
}

describe("composeReducers", () => {
  it("should no-op when passed no args", () => {
    const empty = composeReducers<number>();
    expect(empty(5, constant(4))).toEqual(5);
  });

  it("should delegate to the reducer when given one arg", () => {
    const reducer = composeReducers(add);
    expect(reducer(5, constant(4))).toEqual(9);
  });

  it("should apply reducers in-order when given multiple args", () => {
    const combined = composeReducers(add, multiply, add);
    expect(combined(5, constant(7))).toEqual(91);
  });
});
