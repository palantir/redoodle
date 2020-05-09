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

import { __assign } from "tslib";
import { setWith } from "../index";

interface A {
  a: string;
}

interface B {
  b: string;
}

function clean<T>(obj: T): T {
  return __assign(Object.create(null), obj);
}

describe("setWith", () => {
  describe("when passed an object that overrides a key with a different value", () => {
    let state: A & B, result: A & B;
    beforeAll(() => {
      state = { a: "hello", b: "world" };
      result = setWith<typeof state, keyof A>(state, { a: "goodbye" });
    });

    it("should not mutate the source object", () => {
      expect(state).toEqual({ a: "hello", b: "world" });
    });

    it("should return a new object reference", () => {
      expect(result).not.toBe(state);
    });

    it("should apply the update", () => {
      expect(result).toEqual({ a: "goodbye", b: "world" });
    });
  });

  describe("when passed an object that overrides a key with the same value", () => {
    let state: A & B, result: A & B;
    beforeAll(() => {
      state = { a: "hello", b: "world" };
      result = setWith<typeof state, keyof A>(state, { a: "hello" });
    });

    it("should not mutate the source object", () => {
      expect(state).toEqual({ a: "hello", b: "world" });
    });

    it("should not return a new object reference", () => {
      expect(result).toBe(state);
    });
  });

  describe("when passed an object with non-overlapping key", () => {
    let state: A & Partial<B>, result: A & Partial<B>;
    beforeAll(() => {
      state = { a: "hello" };
      result = setWith<typeof state, keyof B>(state, { b: "world" });
    });

    it("should not mutate the source object", () => {
      expect(state).toEqual({ a: "hello" });
    });

    it("should apply the update", () => {
      expect(result).toEqual({ a: "hello", b: "world" });
    });
  });

  describe("`undefined` value handling", () => {
    it("should treat new `undefined` values as updates", () => {
      const state = { a: "hello" };
      const result = setWith(state as any, { b: undefined });
      expect(result).not.toBe(state);
      expect(Object.prototype.hasOwnProperty.call(result, "b")).toBe(true);
      expect(result.b).toBeUndefined();
    });

    it("should treat overriding `undefined` as no-op", () => {
      const state = { a: undefined };
      const result = setWith(state, { a: undefined });
      expect(result).toBe(state);
    });
  });

  describe("null prototype handling", () => {
    it("should return source object on no-op update", () => {
      const state = clean({ a: "hello", b: "world" });
      const result = setWith(state, { a: "hello" });
      expect(result).toBe(state);
    });

    it("should correctly apply update", () => {
      const state = clean({ a: "hello", b: "world" });
      const result = setWith(state, { a: "goodbye" });
      expect(result).toEqual({ a: "goodbye", b: "world" });
    });

    it("should return object with no prototype on update", () => {
      const state = clean({ a: "hello", b: "world" });
      const result = setWith(state, { a: "goodbye" });
      expect(Object.getPrototypeOf(result)).toBeNull();
    });
  });
});
