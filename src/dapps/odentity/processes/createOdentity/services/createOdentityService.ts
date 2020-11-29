import {CreateOdentityContext} from "../createOdentity";
import {AuthSucceeded, Continuation} from "webnative";

export const createOdentityService = async (context: CreateOdentityContext) =>
{
  if (!window.fissionAuth)
    throw new Error("You're not authenticated");

  const session:AuthSucceeded|Continuation = window.fissionAuth;

  const appPath = session.fs.appPath();
  if (await session.fs.exists(appPath)) {
    console.log("before create:", await session.fs.ls(appPath));
  } else {
    await session.fs.mkdir(appPath);
    await session.fs.publish();
  }

  if (!(await session.fs.exists(session.fs.appPath(["odentity"]))))
  {
    await session.fs.mkdir(session.fs.appPath(["odentity"]));
    await session.fs.publish();
  }

  await session.fs.add(session.fs.appPath(["odentity", "profile.json"]), JSON.stringify({
    firstName: context.data.firstName.value,
    lastName: context.data.lastName.value,
    avatar: context.data.avatar.value
  }));
  await session.fs.publish();
}
