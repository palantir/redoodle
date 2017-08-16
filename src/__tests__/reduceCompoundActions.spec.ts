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

import { Action, CompoundAction, Reducer, TypedAction, reduceCompoundActions } from "../index";

const SetMessage = TypedAction.define("test::set_message")<string>();

function replaceMessageReducer(state: string, action: Action) {
  return SetMessage.is(action) ? action.payload : state;
}

describe("reduceCompoundActions", () => {
  let delegate: jest.Mock<any>;
  let reduce: Reducer<string>;

  beforeAll(() => {
    delegate = jest.fn(replaceMessageReducer);
    reduce = reduceCompoundActions(delegate);
  });

  beforeEach(() => {
    delegate.mockClear();
  });

  it("should delegate normal actions", () => {
    reduce("", SetMessage.create("hello"));
    expect(delegate.mock.calls).toEqual([
      ["", SetMessage.create("hello")],
    ]);
  });

  it("should reduce normal actions to delegate's value", () => {
    const result = reduce("", SetMessage.create("hello"));
    expect(result).toEqual("hello");
  });

  it("should not delegate anything for empty compound actions", () => {
    reduce("", CompoundAction.create([]));
    expect(delegate.mock.calls).toHaveLength(0);
  });

  it("should reduce empty compound actions to initial state", () => {
    const result = reduce("empty", CompoundAction.create([]));
    expect(result).toEqual("empty");
  });

  it("should delegate a single wrapped action", () => {
    reduce("", CompoundAction.create([SetMessage.create("hello")]));
    expect(delegate.mock.calls).toEqual([
      ["", SetMessage.create("hello")],
    ]);
  });

  it("should reduce a single wrapped action to delegate's value", () => {
    const result = reduce("", CompoundAction.create([SetMessage.create("hello")]));
    expect(result).toEqual("hello");
  });

  it("should delegate multiple wrapped actions in order", () => {
    reduce("", CompoundAction.create([
      SetMessage.create("one"),
      SetMessage.create("two"),
      SetMessage.create("three"),
    ]));

    expect(delegate.mock.calls).toEqual([
      ["", SetMessage.create("one")],
      ["one", SetMessage.create("two")],
      ["two", SetMessage.create("three")],
    ]);
  });

  it("should reduce multiple wrapped actions to final delegate value", () => {
    const result = reduce("", CompoundAction.create([
      SetMessage.create("one"),
      SetMessage.create("two"),
      SetMessage.create("three"),
    ]));

    expect(result).toEqual("three");
  });

  it("should delegate and unwrap deeply nested compound actions in order", () => {
    reduce("", CompoundAction.create([
      SetMessage.create("one"),
      CompoundAction.create([
        SetMessage.create("two"),
        SetMessage.create("three"),
      ]),
      SetMessage.create("four"),
    ]));

    expect(delegate.mock.calls).toEqual([
      ["", SetMessage.create("one")],
      ["one", SetMessage.create("two")],
      ["two", SetMessage.create("three")],
      ["three", SetMessage.create("four")],
    ]);
  });

  it("should reduce deeply nested compound actions to final delegate value", () => {
    const result = reduce("", CompoundAction.create([
      SetMessage.create("one"),
      CompoundAction.create([
        SetMessage.create("two"),
        SetMessage.create("three"),
      ]),
      SetMessage.create("four"),
    ]));

    expect(result).toEqual("four");
  });
});
