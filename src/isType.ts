import { Action } from "./Action";
import { TypedAction } from "./TypedAction";
import { TypedActionString } from "./TypedActionString";

export function isType<T>(
  action: Action,
  type: TypedActionString<T>,
): action is TypedAction<T> {
  return action.type === type;
}
