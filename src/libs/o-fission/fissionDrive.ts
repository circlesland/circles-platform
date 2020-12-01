import FileSystem from "webnative/fs/filesystem";
import {Profiles} from "./directories/profiles";
import {Keys} from "./directories/keys";
import {AuthSucceeded, Continuation} from "webnative";

export class FissionDrive
{
  private readonly _fissionAuth: AuthSucceeded|Continuation;
  private readonly _fs: FileSystem;

  get profiles():Profiles {
    return this._profiles;
  }
  private readonly _profiles:Profiles;

  get keys():Keys {
    return this._keys;
  }
  private readonly _keys:Keys;

  constructor(fissionAuth: AuthSucceeded|Continuation)
  {
    this._fissionAuth = fissionAuth;
    this._fs = fissionAuth.fs;

    this._profiles = new Profiles(this._fs);
    this._keys = new Keys(this._fs);
  }
}
