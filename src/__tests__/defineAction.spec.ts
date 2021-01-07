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

import { defineAction } from "../defineAction";

describe("defineAction", () => {
  it("should return actions with correct type and payload", () => {
    const RemoveBar = defineAction("RemoveBar")<number>();
    expect(RemoveBar(4)).toEqual({ type: "RemoveBar", payload: 4 });
  });

  it("should allow no-arg invocation for `undefined` payload definitions", () => {
    const Reset = defineAction("Reset")();
    expect(Reset()).toEqual({ type: "Reset", payload: undefined });
  });

  it("should correctly set `meta` when passing second argument", () => {
    const Reset = defineAction("Reset")();
    expect(
      Reset(undefined, {
        meta: "meta",
      }),
    ).toEqual({ type: "Reset", payload: undefined, meta: "meta" });
  });
});
