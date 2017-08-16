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

import { omit } from "../index";

describe("omit", () => {
  it("should return source object reference on empty keys", () => {
    const state = {a: "hello"};
    const result = omit(state, []);
    expect(result).toBe(state);
  });

  it("should return source object reference on non-overlapping keys", () => {
    const state = {a: "hello"} as {[key: string]: string};
    const result = omit(state, ["b", "c"]);
    expect(result).toBe(state);
  });

  it("should remove an included key", () => {
    const state = {a: "hello", b: "world"};
    const result = omit(state, ["b"]);
    expect(result).toEqual({a: "hello"});
  });

  it("should remove only included keys", () => {
    const state = {a: "hello", b: "world"} as Record<"a" | "b" | "c", string>;
    const result = omit(state, ["b", "c"]);
    expect(result).toEqual({a: "hello"});
  });

  it("should remove all included keys", () => {
    const state = {a: "hello", b: "world", c: "!"};
    const result = omit(state, ["a", "b"]);
    expect(result).toEqual({c: "!"});
  });

  it("should allow empty object return", () => {
    const state = {a: "hello", b: "world", c: "!"};
    const result = omit(state, ["a", "b", "c"]);
    expect(result).toEqual({});
  });

  it("should not mutate source objects", () => {
    const state = {a: "hello", b: "world", c: "!"};
    omit(state, ["a", "b", "c"]);
    expect(state).toEqual({a: "hello", b: "world", c: "!"});
  });

  it("should treat `undefined` removals as updates", () => {
    const state = {a: "hello", b: "world", c: undefined};
    const result = omit(state, ["c"]);
    expect(result).not.toBe(state);
    expect(Object.prototype.hasOwnProperty.call(result, "c")).toBe(false);
  });
});
