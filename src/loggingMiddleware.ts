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
import { CompoundAction } from "./CompoundAction";
import { Dispatch } from "./Dispatch";
import { Middleware } from "./Middleware";
import { prettyPrintPayload } from "./internal/prettyPrintPayload";
import { formatLogTimestamp } from "./internal/utils/formatLogTimestamp";

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

const BLUE2 = "color: #106BA3;";
const GREEN2 = "color: #0D8050;";
const GOLD2 = "color: #BF8C0A;";
const TURQUOISE2 = "color: #00998C;";
const VIOLET2 = "color: #752F75;";
const FONT_WEIGHT_BOLD = "font-weight: bold;";
const FONT_WEIGHT_NORMAL = "font-weight: normal;";
const RESET_STYLE = "";

const defaultOptions = {
  enableInProduction: false,
  handlers: [],
  ignore: () => false,
  includeStackTraces: false,
  prettyPrintSingleActions: true,
};

function normalizeOptions(options: LoggingMiddlewareOptions, defaultHandlers: LoggingHandler[]) {
  const ignore = typeof options.ignore === "function"
      ? options.ignore as (action: Action) => boolean
      : (action: Action) => (options.ignore as string[]).indexOf(action.type) !== -1;

  const includeStackTraces = typeof options.includeStackTraces === "function"
      ? options.includeStackTraces as (action: Action) => boolean
      : (_action: Action) => !!options.includeStackTraces;

  const handlers = [...(options.handlers || []), ...defaultHandlers];

  return {ignore, includeStackTraces, handlers};
}

function logActionDetail({action, previousState, nextState}: LoggingHandlerArgs) {
  console.log("%cpayload   ", VIOLET2, action.payload);
  if (typeof action.meta !== "undefined") {
    console.log("%cmeta      ", GOLD2, action.meta);
  }
  console.log("%ctimestamp ", TURQUOISE2, formatLogTimestamp(new Date()));
  console.log("%cprev state", GREEN2, previousState);
  console.log("%cnext state", GREEN2, nextState);
}

function logSingleActionHeader(prettyPrintSingleActions: boolean, action: Action, scopeName?: string) {
  const formattedPayload = prettyPrintSingleActions
      ? prettyPrintPayload(action.payload)
      : {formatString: "%O", formatArgs: [action.payload]};

  let scopeMessage = "";
  let scopeStyleArgs: string[] = [];

  if (scopeName != undefined) {
    scopeMessage = ` (%c${scopeName}%c)`;
    scopeStyleArgs = [VIOLET2, FONT_WEIGHT_NORMAL];
  }

  (console as any).groupCollapsed(
    `%caction${scopeMessage} %c${action.type} ${formattedPayload.formatString}`,
    FONT_WEIGHT_NORMAL,
    ...scopeStyleArgs,
    BLUE2 + FONT_WEIGHT_NORMAL,
    ...formattedPayload.formatArgs,
  );
}

const defaultHandler = (prettyPrintSingleActions: boolean): LoggingHandler => ({
  accept: action => typeof action === "object",
  log: ({action, nextState, previousState}) => {
    logSingleActionHeader(prettyPrintSingleActions, action);
    try {
      logActionDetail({action, nextState, previousState});
    } finally {
      console.groupEnd();
    }
  },
});

function shortActionName(type: string) {
  return type.substring(Math.max(type.lastIndexOf("/"), type.lastIndexOf(":")) + 1).trim();
}

function logCompoundActionHeader(payload: Action[], scopeName?: string) {
  const loggedActionCount = Math.min(payload.length, 3);
  const styleArgs = [FONT_WEIGHT_NORMAL];
  let message = "%caction";

  if (scopeName != undefined) {
    message += ` (%c${scopeName}%c)`;
    styleArgs.push(VIOLET2, FONT_WEIGHT_NORMAL);
  }

  message += " %ccompound [";
  styleArgs.push(FONT_WEIGHT_BOLD);

  for (let i = 0; i < loggedActionCount; i++) {
    message += "%c" + shortActionName(payload[i].type);
    styleArgs.push(BLUE2 + FONT_WEIGHT_NORMAL);
    if (i !== loggedActionCount - 1) {
      message += "%c, ";
      styleArgs.push(RESET_STYLE);
    }
  }

  if (payload.length > loggedActionCount) {
    const others = payload.length - loggedActionCount;
    message += `%c, and ${others === 1 ? "1 other" : `${others} others`}`;
    styleArgs.push(FONT_WEIGHT_NORMAL);
  }

  message += "%c]";
  styleArgs.push(RESET_STYLE);

  (console as any).groupCollapsed(message, ...styleArgs);
}

const compoundActionsHandler: LoggingHandler = {
  accept: action => CompoundAction.is(action),
  log: ({action, nextState, previousState}) => {
    const payload = action.payload as Action[];
    logCompoundActionHeader(payload);
    try {
      payload.forEach(subAction => {
        console.log(`%c${subAction.type}`, BLUE2, subAction.payload);
      });
      logActionDetail({action, nextState, previousState});
    } finally {
      console.groupEnd();
    }
  },
};

function checkConsoleAvailable() {
  return console.group && console.groupEnd && console.groupCollapsed && console.trace;
}

export function loggingMiddleware(options?: LoggingMiddlewareOptions): Middleware {
  const setOptions = {...defaultOptions, ...options};

  const normalizedOptions = normalizeOptions(setOptions, [
    compoundActionsHandler,
    defaultHandler(setOptions.prettyPrintSingleActions),
  ]);

  return <S>(store: Middleware.Api<S>) => (next: Dispatch) => {
    if (!checkConsoleAvailable()) {
      // tslint:disable-next-line:no-console
      console.log("Redoodle logging disabled: console does not have required functions.");
      return next;
    }

    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV === "production"
    ) {
      if (!setOptions.enableInProduction) {
        if (!PRODUCTION_OFF_WARNING_LOGGED) {
          console.log("Redoodle logging turned off when running in production.");
          PRODUCTION_OFF_WARNING_LOGGED = true;
        }

        return next;
      }

      if (!PRODUCTION_ON_WARNING_LOGGED) {
        console.warn(
          "Redoodle logging is currently ON in this production environment. " +
              "The Redoodle loggers may cause memory leaks that " +
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
          handler.log({action, previousState, nextState});
          break;
        }
      }

      if (normalizedOptions.includeStackTraces(action)) {
        console.trace("%cStack Trace", "color: #bfccd6; font-size: 6pt;");
      }

      return result;
    };
  };
}
