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

// tslint:disable:no-console
import { Action } from "./Action";
import { Dispatch } from "./Dispatch";
import { Middleware } from "./Middleware";

export interface LoggingHandlerArgs {
  previousState: any;
  nextState: any;
  action: Action;
}

export interface LoggingHandler {
  accept: (action: Action) => boolean;
  log: (args: LoggingHandlerArgs) => void;
}

export interface LoggingMiddlewareOptions {
  enableInProduction?: boolean;
  handlers?: LoggingHandler[];
  ignore?: string[] | ((action: Action) => boolean);
  includeStackTraces?: boolean | ((action: Action) => boolean);
  prettyPrintSingleActions?: boolean;
}

declare const process: any;
let PRODUCTION_ON_WARNING_LOGGED = false;
let PRODUCTION_OFF_WARNING_LOGGED = false;

const defaultOptions = {
  enableInProduction: false,
  handlers: [],
  ignore: () => false,
  includeStackTraces: false,
  prettyPrintSingleActions: true,
};

function normalizeOptions(rawOptions: LoggingMiddlewareOptions | undefined) {
  const options = { ...defaultOptions, ...rawOptions };
  const ignore =
    typeof options.ignore === "function"
      ? (options.ignore as (action: Action) => boolean)
      : (action: Action) =>
          (options.ignore as string[]).indexOf(action.type) !== -1;

  const includeStackTraces =
    typeof options.includeStackTraces === "function"
      ? (options.includeStackTraces as (action: Action) => boolean)
      : (_action: Action) => !!options.includeStackTraces;

  const handlers = [...(options.handlers || []), defaultHandler];

  return { ignore, includeStackTraces, handlers };
}

const GRAY = "color: #888;";
const ROSE3 = "color: #DB2C6F;";
const defaultHandler: LoggingHandler = {
  accept: (action) => typeof action === "object",
  log: ({ action, nextState, previousState }) => {
    console.log(
      "%credoodle %c%s %c%o %O prevState=%O nextState=%O",
      GRAY,
      ROSE3,
      action.type,
      GRAY,
      action.payload,
      action.meta !== undefined ? action.meta : "",
      previousState,
      nextState,
    );
  },
};

export function loggingMiddleware(
  options?: LoggingMiddlewareOptions,
): Middleware {
  const normalizedOptions = normalizeOptions(options);

  return <S>(store: Middleware.Api<S>) => (next: Dispatch) => {
    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV === "production"
    ) {
      if (!options?.enableInProduction) {
        if (!PRODUCTION_OFF_WARNING_LOGGED) {
          console.log(
            "Redoodle logging turned off when running in production.",
          );
          PRODUCTION_OFF_WARNING_LOGGED = true;
        }

        return next;
      }

      if (!PRODUCTION_ON_WARNING_LOGGED) {
        console.warn(
          "Redoodle logging is currently ON in this production environment. " +
            "The Redoodle logging may cause memory leaks that " +
            " lead to application crashes after long periods of usage. " +
            "It is highly recommended to initialize loggingMiddleware with {enableInProduction: false}.",
        );

        PRODUCTION_ON_WARNING_LOGGED = true;
      }
    }

    return (action: any) => {
      if (normalizedOptions.ignore(action)) {
        return next(action);
      }

      const previousState = store.getState();
      const result = next(action);
      const nextState = store.getState();

      for (let i = 0; i < normalizedOptions.handlers.length; i++) {
        const handler = normalizedOptions.handlers[i];
        if (handler.accept(action)) {
          handler.log({ action, previousState, nextState });
          break;
        }
      }

      if (normalizedOptions.includeStackTraces(action)) {
        console.trace("%cStack Trace", "color: #bfccd6; font-size: 10px;");
      }

      return result;
    };
  };
}
