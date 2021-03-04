import type * as redux from "redux";
import { createStore } from "../createStore";

interface State {
  foo: number;
}

function __unused(_value: any) {
  // noop
}

it("Redoodle Store should be compatible with Redux Store typing", () => {
  // we actually only need this to compile, so there's no real "test" here
  const reduxStore: redux.Store<State> = createStore<State>((s: State) => s, {
    foo: 5,
  });

  __unused(reduxStore);
});
