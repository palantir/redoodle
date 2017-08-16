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

import { Action } from "./Action";
import { Reducer } from "./Reducer";
import { Store } from "./Store";
import { StoreEnhancer } from "./StoreEnhancer";
import { isPlainObject } from "./internal/utils/isPlainObject";

interface Listener {
  (): void;
}

/**
 * Behaviorally the same function as core Redux createStore().
 * Unlike the Redux variant,
 *
 * - This function requires initial state, instead of making it optional.
 * - This function applies fewer runtime checks for usage correctness w.r.t. type disagreements.
 * - This function makes no attempt to integrate cleanly with Observables.
 *
 * If you do want an expanded feature set, please do consider using the stock Redux.createStore().
 */
export function createStore<S>(reducer: Reducer<S>, initialState: S, enhancer?: StoreEnhancer): Store<S> {
  if (typeof enhancer !== "undefined") {
    return enhancer<S>(createStore)(reducer, initialState);
  }

  let currentReducer: Reducer<S> = reducer;
  let currentState = initialState;
  let currentListeners: Listener[] = [];
  let nextListeners: Listener[] = currentListeners;
  let isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  function getState() {
    return currentState;
  }

  function subscribe(listener: Listener) {
    let isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  function dispatch<A extends Action>(action: A) {
    if (!isPlainObject(action)) {
      throw new Error(
        "Actions must be plain objects. " +
        "Use custom middleware for async actions.",
      );
    }

    if (isDispatching) {
      throw new Error("Reducers may not dispatch actions.");
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    const listeners = currentListeners = nextListeners;
    for (let i = 0; i < listeners.length; i++) {
      listeners[i]();
    }

    return action;
  }

  function replaceReducer(nextReducer: Reducer<S>) {
    currentReducer = nextReducer;
  }

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
  };
}
