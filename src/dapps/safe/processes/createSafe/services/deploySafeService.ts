import {CreateSafeContext} from "../createSafe";

export const deploySafeService = async (context: CreateSafeContext) =>
{
  // TODO
  if(!context.environment.fission) {
    throw new Error("You're not authenticated.");
  }
}
