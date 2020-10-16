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

import { TypedAction } from "../TypedAction";
import { TypedReducer } from "../TypedReducer";

interface CountState {
  total: number;
}

describe("TypedReducer", () => {
  const Log = TypedAction.define("test::log")<string[]>();
  const Count = TypedAction.define("test::count")<number>();
  const Reset = TypedAction.define("test::reset")<number>();

  it("should return a reducer function", () => {
    const reducer = TypedReducer.builder().build();
    expect(typeof reducer).toEqual("function");
  });

  it("should default to no-op reducer", () => {
    const reducer = TypedReducer.builder().build();
    expect(reducer("hello", Count.create(3))).toEqual("hello");
  });

  it("should allow specification of default reducer", () => {
    const reducer = TypedReducer.builder()
      .withDefaultHandler((state) => state + "!")
      .build();

    expect(reducer("hello", Count.create(3))).toEqual("hello!");
  });

  it("should allow specification of typed mappings", () => {
    const reducer = TypedReducer.builder<CountState>()
      .withActionHandler(Count.TYPE, (state, action) => ({
        total: state.total + action.payload,
      }))
      .build();

    expect(reducer({ total: 5 }, Count.create(3))).toEqual({ total: 8 });
  });

  it("should allow specifying payload-only handlers", () => {
    const reducer = TypedReducer.builder<CountState>()
      .withHandler(Count.TYPE, (state, toAdd) => ({
        total: state.total + toAdd,
      }))
      .build();

    expect(reducer({ total: 5 }, Count.create(3))).toEqual({ total: 8 });
  });

  it("should allow specifying definition payload-only handlers", () => {
    const reducer = TypedReducer.builder<CountState>()
      .withDefinitionHandler(Count, (state, toAdd) => ({
        total: state.total + toAdd,
      }))
      .build();

    expect(reducer({ total: 5 }, Count.create(3))).toEqual({ total: 8 });
  });

  it("should only invoke handlers for existing actions", () => {
    const reducer = TypedReducer.builder<CountState>()
      .withActionHandler(
        Count.TYPE,
        (_state, _action): CountState => {
          throw new Error("handle COUNT should not have been called");
        },
      )
      .build();

    expect(reducer({ total: 5 }, Reset.create(3))).toEqual({ total: 5 });
  });

  it("should allow specifying multiple handlers", () => {
    const reducer = TypedReducer.builder<CountState>()
      .withActionHandler(Count.TYPE, (state, action) => ({
        total: state.total + action.payload,
      }))
      .withActionHandler(Reset.TYPE, (_state, action) => ({
        total: action.payload,
      }))
      .build();

    let countState: CountState = { total: 5 };
    countState = reducer(countState, Reset.create(10));
    countState = reducer(countState, Count.create(4));
    expect(countState).toEqual({ total: 14 });
  });

  it("should preserve typings (complex code compiles)", () => {
    const reducer = TypedReducer.builder<CountState>()
      .withActionHandler(Log.TYPE, (state, action) => ({
        total:
          state.total +
          action.payload.map((s) => s.length).reduce((a, b) => a + b),
      }))
      .build();

    expect(reducer({ total: 8 }, Log.create(["foobar", "world"]))).toEqual({
      total: 19,
    });
  });
});
