import {CreateSafeContext} from "../createSafe";

export const deploySafeService = async (context: CreateSafeContext) =>
{
  // TODO
  if(!context.environment.fissionAuth) {
    throw new Error("You're not authenticated.");
  }
}
