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

import { Action, TypedAction } from "../index";

describe("TypedAction", () => {
  describe("Definition", () => {
    let SetMessage: TypedAction.Definition<"test::set_message", string>;
    beforeAll(() => {
      SetMessage = TypedAction.define("test::set_message")<string>();
    });

    describe("when called as function, the returned action", () => {
      let action: TypedAction<string>;
      beforeAll(() => {
        action = SetMessage("Hello World");
      });

      it("should have defined type", () => {
        expect(action).toBeDefined();
        expect(action.type).toEqual(SetMessage.TYPE);
      });

      it("should have given payload", () => {
        expect(action.payload).toEqual("Hello World");
      });

      it("should return actions with correct typing information", () => {
        expect(typeof action.payload.charAt).toBe("function");
      });

      it("should return actions without a 'meta' key", () => {
        expect(action).not.toHaveProperty("meta");
      });
    });

    describe("#TYPE", () => {
      it("should match", () => {
        expect(SetMessage.TYPE).toBe("test::set_message");
      });
    });

    describe("#create", () => {
      let action: TypedAction<string>;
      beforeAll(() => {
        action = SetMessage.create("Hello World");
      });

      it("should have defined type", () => {
        expect(action).toBeDefined();
        expect(action.type).toEqual(SetMessage.TYPE);
      });

      it("should have given payload", () => {
        expect(action.payload).toEqual("Hello World");
      });

      it("should return actions with correct typing information", () => {
        expect(typeof action.payload.charAt).toBe("function");
      });

      it("should return actions without a 'meta' key", () => {
        expect(action).not.toHaveProperty("meta");
      });
    });

    describe("#createWithMeta", () => {
      let action: TypedAction<string>;
      beforeAll(() => {
        action = SetMessage.createWithMeta("Hello World", "metameta");
      });

      it("should have defined type", () => {
        expect(action).toBeDefined();
        expect(action.type).toEqual(SetMessage.TYPE);
      });

      it("should have given payload", () => {
        expect(action.payload).toEqual("Hello World");
      });

      it("should return actions with correct typing information", () => {
        expect(typeof action.payload.charAt).toBe("function");
      });

      it("should set meta", () => {
        expect(action.meta).toEqual("metameta");
      });
    });

    describe("#is", () => {
      it("should return `true` for actions with matching type", () => {
        expect(SetMessage.is({ type: "test::set_message" })).toBe(true);
      });

      it("should return `false` for actions with mismatched type", () => {
        expect(SetMessage.is({ type: "test::other" })).toBe(false);
      });

      it("should apply type guard", () => {
        // Remark: this test is really checking if code compiles
        const action = SetMessage.create("foo") as Action;
        if (SetMessage.is(action)) {
          expect(action.payload.length).toBe(3);
        }
      });

      it("should not crash on actions with non-string types", () => {
        SetMessage.is({ type: false });
        SetMessage.is({} as any);
        SetMessage.is({ type: Object.create(null) });
        // pass
      });
    });
  });

  describe("Definition (with validator)", () => {
    let SetMessage: TypedAction.Definition<"test::set_message", string>;
    beforeAll(() => {
      SetMessage = TypedAction.define("test::set_message")<string>({
        validate: (message) => message !== "blacklist",
      });
    });

    describe("when called as function (validation pass), the returned action", () => {
      let action: TypedAction<string>;
      beforeAll(() => {
        action = SetMessage("Hello World");
      });

      it("should have defined type", () => {
        expect(action).toBeDefined();
        expect(action.type).toEqual(SetMessage.TYPE);
      });

      it("should have given payload", () => {
        expect(action.payload).toEqual("Hello World");
      });

      it("should return actions with correct typing information", () => {
        expect(typeof action.payload.charAt).toBe("function");
      });

      it("should return actions without a 'meta' key when no meta is provided", () => {
        expect(action).not.toHaveProperty("meta");
      });
    });

    describe("#TYPE", () => {
      it("should match", () => {
        expect(SetMessage.TYPE).toBe("test::set_message");
      });
    });

    describe("#create (validation pass)", () => {
      let action: TypedAction<string>;
      beforeAll(() => {
        action = SetMessage.create("Hello World");
      });

      it("should have defined type", () => {
        expect(action).toBeDefined();
        expect(action.type).toEqual(SetMessage.TYPE);
      });

      it("should have given payload", () => {
        expect(action.payload).toEqual("Hello World");
      });

      it("should return actions with correct typing information", () => {
        expect(typeof action.payload.charAt).toBe("function");
      });

      it("should return actions without a 'meta' key when no meta is provided", () => {
        expect(action).not.toHaveProperty("meta");
      });
    });

    describe("when called as function (validation fail)", () => {
      it("should throw", () => {
        expect(() => {
          SetMessage("blacklist");
        }).toThrow();
      });
    });

    describe("#create (validation fail)", () => {
      it("should throw", () => {
        expect(() => {
          SetMessage.create("blacklist");
        }).toThrow();
      });
    });

    describe("#createWithMeta (validation pass)", () => {
      let action: TypedAction<string>;
      beforeAll(() => {
        action = SetMessage.createWithMeta("Hello World", "metameta");
      });

      it("should have defined type", () => {
        expect(action).toBeDefined();
        expect(action.type).toEqual(SetMessage.TYPE);
      });

      it("should have given payload", () => {
        expect(action.payload).toEqual("Hello World");
      });

      it("should return actions with correct typing information", () => {
        expect(typeof action.payload.charAt).toBe("function");
      });

      it("should set meta", () => {
        expect(action.meta).toEqual("metameta");
      });
    });

    describe("#createWithMeta (validation fail)", () => {
      it("should throw", () => {
        expect(() => {
          SetMessage.createWithMeta("blacklist", "metameta");
        }).toThrow();
      });
    });

    describe("#is", () => {
      it("should return `true` for actions with matching type", () => {
        expect(SetMessage.is({ type: "test::set_message" })).toBe(true);
      });

      it("should return `false` for actions with mismatched type", () => {
        expect(SetMessage.is({ type: "test::other" })).toBe(false);
      });

      it("should apply type guard", () => {
        // Remark: this test is really checking if code compiles
        const action = SetMessage.create("foo") as Action;
        if (SetMessage.is(action)) {
          expect(action.payload.length).toBe(3);
        }
      });

      it("should not crash on actions with non-string types", () => {
        SetMessage.is({ type: false });
        SetMessage.is({} as any);
        SetMessage.is({ type: Object.create(null) });
        // pass
      });

      it("should return `true` even if payload would fail validation", () => {
        expect(
          SetMessage.is({ type: "test::set_message", payload: "blacklist" }),
        ).toBe(true);
      });
    });
  });
});
