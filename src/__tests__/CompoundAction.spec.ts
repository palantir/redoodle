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

import { Action, CompoundAction, TypedAction, reduceCompoundActions } from "../index";

const SetMessage = TypedAction.define("test::set_message")<string>();

describe("CompoundAction", () => {
  describe("CompoundAction.create([...])", () => {
    it("should return an action with type " + CompoundAction.TYPE, () => {
      const action = CompoundAction.create([SetMessage.create("hi")]);
      expect(action.type).toEqual(CompoundAction.TYPE);
    });

    it("should allow creating a compound action with no sub actions", () => {
      const action = CompoundAction.create([]);
      expect(action).toBeDefined();
      expect(action.payload).toHaveLength(0);
    });

    it("should forward a list of actions as a payload", () => {
      const action = CompoundAction.create([SetMessage.create("hello"), SetMessage.create("world")]);
      expect(action.payload).toEqual([SetMessage.create("hello"), SetMessage.create("world")]);
    });
  });

  describe("nested CompoundActions", () => {
    interface ConcatenatedState {
      messages: string[];
    }

    const concatenatingReducer = (state: ConcatenatedState, action: Action) => {
      return SetMessage.is(action)
          ? {messages: [...state.messages, action.payload]}
          : state;
    };

    it("should handle one-level nesting", () => {
      const action = CompoundAction.create([
        SetMessage.create("redoodle"),
        SetMessage.create("is"),
        CompoundAction.create([
          SetMessage.create("not"),
          SetMessage.create("bad"),
        ]),
      ]);

      const reduced = reduceCompoundActions(concatenatingReducer)({messages: []}, action);
      expect(reduced).toEqual({
        messages: [
          "redoodle",
          "is",
          "not",
          "bad",
        ],
      });
    });

    it("should handle two-level nesting", () => {
      const action = CompoundAction.create([
        SetMessage.create("redoodle"),
        SetMessage.create("is"),
        CompoundAction.create([
          SetMessage.create("not"),
          CompoundAction.create([
            SetMessage.create("bad"),
          ]),
        ]),
      ]);

      const reduced = reduceCompoundActions(concatenatingReducer)({messages: []}, action);
      expect(reduced).toEqual({
        messages: [
          "redoodle",
          "is",
          "not",
          "bad",
        ],
      });
    });
  });
});
