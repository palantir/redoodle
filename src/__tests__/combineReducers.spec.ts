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

import { Action, Reducer, combineReducers } from "../index";

interface A {
  a: number;
}

function constant(payload: number): Action {
  return {
    type: "test::constant",
    payload,
  };
}

const add: Reducer<number> = (state: number, action: Action) => {
  if (action.type === "test::constant") {
    return state + action.payload;
  }

  /* Remark: this isn't a compliant stock Redux reducer (on purpose), as
   * it doesn't handle state === null initialization.
   */
  return state;
};

describe("combineReducers", () => {
  it("should not throw on empty map input", () => {
    const reducer = combineReducers({});
    expect(reducer({}, constant(0))).toEqual({});
  });

  it("should delegate to a single reducer for a key", () => {
    const reducer = combineReducers({ a: add });
    expect(reducer({ a: 4 }, constant(5))).toEqual({ a: 9 });
  });

  it("should delegate to multiple reducers for each action", () => {
    const reducer = combineReducers({ a: add, b: add });
    expect(reducer({ a: 4, b: 40 }, constant(5))).toEqual({ a: 9, b: 45 });
  });

  it("should throw on first invocation if state and reducers have mismatched shape", () => {
    const reduceA = combineReducers<any>({ a: add });
    expect(() => reduceA({ a: 4, b: 40 }, constant(5))).toThrow();

    const reduceAB = combineReducers<any>({ a: add, b: add });
    expect(() => reduceAB({ a: 4 }, constant(5))).toThrow();
  });

  describe("initial state handling", () => {
    it("should not throw on creation (initial state handled externally)", () => {
      const reducer = combineReducers({ a: add });
      expect(reducer).toBeDefined();
    });

    it("should throw when a reducer returns undefined on input state == null", () => {
      const reducer = combineReducers({ a: add, b: () => 0 });
      expect(() =>
        reducer(undefined as any, { type: "redoodle/test/INIT", payload: {} }),
      ).toThrow();
    });
  });

  describe("prototype defense", () => {
    it("should properly reduce a subkey 'hasOwnProperty'", () => {
      const reducer = combineReducers({ hasOwnProperty: add });
      expect(reducer({ hasOwnProperty: 4 }, constant(5))).toEqual({
        hasOwnProperty: 9,
      });
    });

    it("should return an object with Object prototype when given state with Object prototype", () => {
      const reducer = combineReducers({ a: add });
      expect(Object.getPrototypeOf(reducer({ a: 4 }, constant(5)))).toBe(
        Object.prototype,
      );
    });

    it("should reduce an initial state with `null` prototype", () => {
      const initialState = Object.create(null) as A;
      initialState.a = 4;
      const reducer = combineReducers({ a: add });
      expect(reducer(initialState, constant(5))).toEqual({ a: 9 });
    });

    it("should return an object with null prototype if input state has null prototype", () => {
      const initialState = Object.create(null) as A;
      initialState.a = 4;
      const reducer = combineReducers({ a: add });
      expect(Object.getPrototypeOf(reducer(initialState, constant(5)))).toEqual(
        null,
      );
    });
  });
});
