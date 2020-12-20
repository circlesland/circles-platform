import FileSystem from "webnative/fs/filesystem";
import { Profiles } from "./directories/profiles";
import { Keys } from "./directories/keys";
import { AuthSucceeded, Continuation } from "webnative";
import { Tokens } from "./directories/tokens";
import {BlocksDir} from "./directories/blocks";

export class FissionDrive {
  private readonly _fissionAuth: AuthSucceeded | Continuation;
  private readonly _fs: FileSystem;

  get username(): string {
    return this._fissionAuth.username;
  }

  get profiles(): Profiles {
    return this._profiles;
  }
  private readonly _profiles: Profiles;

  get keys(): Keys {
    return this._keys;
  }
  private readonly _keys: Keys;

  get blocks(): BlocksDir {
    return this._blocks;
  }
  private readonly _blocks: BlocksDir;

  get tokens(): Tokens {
    return this._tokens;
  }
  private readonly _tokens: Tokens;


  constructor(fissionAuth: AuthSucceeded | Continuation) {
    this._fissionAuth = fissionAuth;
    this._fs = fissionAuth.fs;

    this._profiles = new Profiles(this._fs);
    this._keys = new Keys(this._fs);
    this._blocks = new BlocksDir(this._fs);
    this._tokens = new Tokens(this._fs);
    // this._events = new EventStore(this._fs, ["eventStore"]);
  }
}
