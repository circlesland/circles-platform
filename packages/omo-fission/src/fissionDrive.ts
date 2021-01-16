import FileSystem from "webnative/fs/filesystem";
import { Profiles } from "./directories/profiles";
import { Keys } from "./directories/keys";
import {AuthSucceeded, Continuation, loadFileSystem} from "webnative";
import {CirclesTransactions} from "./directories/circlesTransactions";
import {CirclesTokens} from "./directories/circlesTokens";
import {SessionLogs} from "./directories/logs";
import {Offers} from "./directories/offers";
import {BehaviorSubject} from "rxjs";
import {initAuth} from "./initFission";
import {tryGetDappState} from "../o-os/loader";
import {Envelope} from "omo-kernel/dist/interfaces/envelope";
import {FissionAuthState} from "./state/fissionAuthState";

export class FissionDrive
{
  private readonly _fissionAuth: AuthSucceeded | Continuation;

  get fs() : FileSystem|undefined
  {
    return this._fs;
  }
  private _fs?: FileSystem;

  get username(): string {
    return this._fissionAuth.username;
  }

  get profiles(): Profiles|undefined {
    return this._profiles;
  }
  private _profiles?: Profiles;

  get keys(): Keys|undefined {
    return this._keys;
  }
  private _keys?: Keys;

  get transactions(): CirclesTransactions|undefined {
    return this._transactions;
  }
  private _transactions?: CirclesTransactions;

  get tokens(): CirclesTokens|undefined {
    return this._tokens;
  }
  private _tokens?: CirclesTokens;

  get offers(): Offers|undefined {
    return this._offers;
  }
  private _offers?: Offers;

  get sessionLogs(): SessionLogs|undefined {
    return this._sessionLogs;
  }
  private _sessionLogs?: SessionLogs;

  constructor(fissionAuth: AuthSucceeded | Continuation)
  {
    this._fissionAuth = fissionAuth;
  }

  async init()
  {
    this._fs = await loadFileSystem(this._fissionAuth.permissions, this._fissionAuth.username);
    this._sessionLogs = new SessionLogs(this._fissionAuth.username, this._fs);
    this._profiles = new Profiles(this._fissionAuth.username, this._fs);
    this._keys = new Keys(this._fissionAuth.username, this._fs);
    this._transactions = new CirclesTransactions(this._fissionAuth.username, this._fs);
    this._tokens = new CirclesTokens(this._fissionAuth.username, this._fs);
    this._offers = new Offers(this._fissionAuth.username, this._fs);
  }
}
let initializingDrive:boolean = false;

export async function runWithDrive<TOut>(func:(drive:FissionDrive) => Promise<TOut>) : Promise<TOut>
{
  let fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  if (!fissionAuthState)
  {
    const initAuthSuccess = await initAuth();
    if (!initAuthSuccess)
    {
      throw new Error("Cannot access your fission drive: The authorization failed.");
    }
  }

  fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  if (!fissionAuthState.fission)
  {
    fissionAuthState.fission = new BehaviorSubject<Envelope<FissionDrive>>(null);
  }

  const existingDrive = fissionAuthState.fission.getValue()?.payload;
  if (!existingDrive && !initializingDrive)
  {
    const initFsBegin = Date.now();
    initializingDrive = true;
    // FS is not loaded yet. Load it.
    const drive = new FissionDrive(fissionAuthState.fissionState)
    drive.init().then(() => {
      const current = fissionAuthState.fission.getValue();
      fissionAuthState.fission.next({
        signal: current?.signal,
        payload: drive
      });
      const initFsEnd = Date.now();
      const initFsDuration = (initFsEnd - initFsBegin) / 1000
      // window.o.logger.log("initFsDuration", initFsDuration)
      initializingDrive = false;
    });
  }

  return new Promise((resolve, reject) =>
  {
    const sub = fissionAuthState.fission.subscribe(async (fissionDrive:Envelope<FissionDrive>) =>
    {
      if (!fissionDrive || !(fissionDrive.payload instanceof FissionDrive))
        return;

      func(fissionDrive.payload)
        .then(result => {
          resolve(<TOut>result);
          sub.unsubscribe();
        })
        .catch(error => {
          reject(error);
          sub.unsubscribe();
        });
    });
  });
}

export async function withTimeout<T>(operationName:string, func: () => Promise<T>, timeout?:number) : Promise<T>
{
  return new Promise((resolve, reject) =>
  {
    let resolved = false;
    if (timeout)
    {
      setTimeout(() =>
      {
        if (resolved)
        {
          return;
        }
        reject(new Error(`The execution of ${operationName} timed out after ${timeout / 1000} seconds.`));
      }, timeout);
    }

    try {
      func()
        .then(result => {
          resolved = true;
          resolve(result);
        })
        .catch(error => reject(error));
    }
    catch (e)
    {
      reject(e);
    }
  });
}
