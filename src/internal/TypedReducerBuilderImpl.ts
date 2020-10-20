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

import { Action } from "../Action";
import { Reducer } from "../Reducer";
import { TypedAction } from "../TypedAction";
import { TypedActionDefinition2 } from "../TypedActionDefinition2";
import { TypedActionString } from "../TypedActionString";
import { TypedReducer } from "../TypedReducer";

export class TypedReducerBuilderImpl<S> implements TypedReducer.Builder<S> {
  private typedHandlers: { [type: string]: Reducer<S> } = {};
  private defaultHandler: Reducer<S> | undefined;

  withHandler<T>(
    type: TypedActionString<T>,
    handler: (state: S, payload: T, meta: any | undefined) => S,
  ): this {
    return this.withActionHandler(type, (state, action) => {
      return handler(state, action.payload, action.meta);
    });
  }

  withDefinitionHandler<T, E extends string = string>(
    type:
      | TypedActionDefinition2<E, T>
      | TypedAction.Definition<E, T>
      | TypedAction.NoPayloadDefinition<E>,
    handler: (state: S, payload: T, meta: any | undefined) => S,
  ): this {
    return this.withHandler(type.TYPE, handler);
  }

  withActionHandler<T, E extends string = string>(
    type: TypedActionString<T, E>,
    handler: (state: S, action: TypedAction<T, E>) => S,
  ): this {
    if (this.typedHandlers[type as string]) {
      if (process.env.NODE_ENV === "production") {
        // tslint:disable-next-line:no-console
        console.error(
          `Multiple typed reducer handlers specified in typed reducer for type ${type}. Using newer.`,
        );
      } else {
        throw new Error(
          `Multiple typed reducer handlers specified in typed reducer for type ${type}.`,
        );
      }
    }

    this.typedHandlers[type as string] = handler as Reducer<S>;
    return this;
  }

  withDefaultHandler(handler: (state: S, action: Action) => S) {
    if (this.defaultHandler) {
      if (process.env.NODE_ENV === "production") {
        // tslint:disable-next-line:no-console
        console.error(
          "Multiple default handlers specified in typed reducer. Using newer.",
        );
      } else {
        throw new Error(
          "Multiple default handlers specified in typed reducer.",
        );
      }
    }

    this.defaultHandler = handler;
    return this;
  }

  build(): Reducer<S> {
    const defaultHandler: Reducer<S> =
      this.defaultHandler || ((state: S) => state);
    return new TypedReducerImpl<S>({ ...this.typedHandlers }, defaultHandler)
      .reduce;
  }
}

class TypedReducerImpl<S> {
  private typedHandlers: { [type: string]: Reducer<S> };
  private defaultHandler: Reducer<S>;

  constructor(
    typedHandlers: { [type: string]: Reducer<S> },
    defaultHandler: Reducer<S>,
  ) {
    this.typedHandlers = typedHandlers;
    this.defaultHandler = defaultHandler;
  }

  reduce = (state: S, action: Action): S => {
    const typedHandler = this.typedHandlers[action.type];
    if (typedHandler) {
      return typedHandler(state, action);
    } else {
      return this.defaultHandler(state, action);
    }
  };
}
