import type * as redux from "redux";
import { createStore } from "../createStore";

interface State {
  foo: number;
}

function __unused(_value: any) {
  // noop
}

// @ts-ignore since this function is never used
function test() {
  // we actually only need this to compile, so there's no real "test" here
  const reduxStore: redux.Store<State> = createStore<State>((s: State) => s, {
    foo: 5,
  });

  __unused(reduxStore);
}
