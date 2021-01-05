import FileSystem from './fs';
import { Maybe } from './common';
import { Permissions } from './ucan/permissions';
/**
 * Load a user's file system.
 *
 * @param permissions The permissions from initialise.
 *                    Pass `null` if working without permissions
 * @param username Optional, username of the user to load the file system from.
 *                 Will try to load the file system of the authenticated user
 *                 by default. Throws an error if there's no authenticated user.
 */
export declare function loadFileSystem(permissions: Maybe<Permissions>, username?: string): Promise<FileSystem>;
