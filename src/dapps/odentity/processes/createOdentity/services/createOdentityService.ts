import {CreateOdentityContext} from "../createOdentity";
import {AuthSucceeded, Continuation} from "webnative";
import {FissionPaths} from "../../../../../libs/o-os/fissionPaths";

export const createOdentityService = async (context: CreateOdentityContext) =>
{
  if (!window.o.fissionAuth)
    throw new Error("You're not authenticated");

  try
  {
    const session: AuthSucceeded | Continuation = context.environment.fissionAuth;

    const appPath = session.fs.appPath();
    if (!await session.fs.exists(appPath))
    {
      await session.fs.mkdir(appPath);
    }

    if (!(await session.fs.exists(FissionPaths.odentityDir())))
    {
      await session.fs.mkdir(FissionPaths.odentityDir());
    }

    if (!(await session.fs.exists(FissionPaths.publicOdentityDir())))
    {
      await session.fs.mkdir(FissionPaths.publicOdentityDir());
    }

    await session.fs.add(FissionPaths.profile(), JSON.stringify({
      firstName: context.data.firstName.value,
      lastName: context.data.lastName.value,
      avatar: context.data.avatar.value
    }));
    await session.fs.add(FissionPaths.publicProfile(), JSON.stringify({
      firstName: context.data.firstName.value,
      lastName: context.data.lastName.value,
      avatar: context.data.avatar.value
    }));

    await session.fs.publish();
  } catch (e) {
    console.error(e);
    throw e;
  }
}
