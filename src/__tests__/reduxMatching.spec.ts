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

import * as Redux from "redux";
import { Dispatch, Middleware } from "../index";

describe("Redux shape matching", () => {
  describe("Middleware", () => {
    it("should be assignable to Redux.Middleware", () => {
      const middleware: Middleware = undefined!;
      const reduxMiddleware: Redux.Middleware = middleware;

      // reference variables so compiler isn't angry
      [middleware, reduxMiddleware];
    });
    it("should be assignable from Redux.Middleware", () => {
      const reduxMiddleware: Redux.Middleware = undefined!;
      const middleware: Middleware = reduxMiddleware;

      // reference variables so compiler isn't angry
      [middleware, reduxMiddleware];
    });
  });
  describe("Dispatch", () => {
    it("should be assignable to Redux.Dispatch", () => {
      const dispatch: Dispatch = undefined!;
      const reduxDispatch: Redux.Dispatch = dispatch;

      // reference variables so compiler isn't angry
      [dispatch, reduxDispatch];
    });
    it("should be assignable from Redux.Dispatch", () => {
      const reduxDispatch: Redux.Dispatch<any> = undefined!;
      const dispatch: Dispatch = reduxDispatch;

      // reference variables so compiler isn't angry
      [dispatch, reduxDispatch];
    });
  });
});
