import {CreateOdentityContext} from "../createOdentity";
import {AuthSucceeded, Continuation} from "webnative";
import {FissionPaths} from "../../../../../libs/o-os/fissionPaths";

export const createOdentityService = async (context: CreateOdentityContext) =>
{
  if (!window.o.fissionAuth)
    throw new Error("You're not authenticated");

  const session:AuthSucceeded|Continuation = context.environment.fissionAuth;

  const appPath = session.fs.appPath();
  if (await session.fs.exists(appPath)) {
    console.log("before create:", await session.fs.ls(appPath));
  } else {
    await session.fs.mkdir(appPath);
    await session.fs.publish();
  }

  if (!(await session.fs.exists(FissionPaths.odentityDir())))
  {
    await session.fs.mkdir(FissionPaths.odentityDir());
    await session.fs.publish();
  }

  await session.fs.add(FissionPaths.profile(), JSON.stringify({
    firstName: context.data.firstName.value,
    lastName: context.data.lastName.value,
    avatar: context.data.avatar.value
  }));
  await session.fs.publish();
}
