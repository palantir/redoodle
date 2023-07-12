import { TypedAction } from "./TypedAction";
import { TypedActionDefinition2 } from "./TypedActionDefinition2";

export type PayloadOf<
  D extends TypedAction.Definition<any, any> | TypedActionDefinition2<any, any>
> = D["__PAYLOAD"];
