import type * as redux from "redux";
import { createStore } from "../createStore";

interface State {
  foo: number;
}

// @ts-ignore
function test() {
  // we actually only need this to compile, so there's no real "test" here
  const reduxStore: redux.Store<State> = createStore<State>((s: State) => s, {
    foo: 5,
  });
}
