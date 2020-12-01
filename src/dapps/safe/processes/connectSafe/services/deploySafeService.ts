import {ConnectSafeContext} from "../connectSafe";

export const deploySafeService = async (context: ConnectSafeContext) =>
{
  // TODO
  if(!context.environment.fission) {
    throw new Error("You're not authenticated.");
  }
}
