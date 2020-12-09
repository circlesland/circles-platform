import FileSystem from "webnative/fs/filesystem";
import {Profiles} from "./directories/profiles";
import {Keys} from "./directories/keys";
import {AuthSucceeded, Continuation} from "webnative";
import {Tokens} from "./directories/tokens";
import {CacheEvent} from "./entities/cacheEvent";
import {EventStore} from "./eventStore";
import {CirclesHub} from "../o-circles-protocol/circles/circlesHub";
import {config} from "../o-circles-protocol/config";
import {Aggregates} from "./directories/aggregates";

export class FissionDrive
{
  private readonly _fissionAuth: AuthSucceeded|Continuation;
  private readonly _fs: FileSystem;

  get username() :string {
    return this._fissionAuth.username;
  }

  get profiles():Profiles {
    return this._profiles;
  }
  private readonly _profiles:Profiles;

  get keys():Keys {
    return this._keys;
  }
  private readonly _keys:Keys;

  get tokens():Tokens {
    return this._tokens;
  }
  private readonly _tokens:Tokens;

  get values():Aggregates {
    return this._values;
  }
  private readonly _values:Aggregates;

  get events():EventStore<CacheEvent> {
    return this._events;
  }
  private readonly _events:EventStore<CacheEvent>;

  constructor(fissionAuth: AuthSucceeded|Continuation)
  {
    this._fissionAuth = fissionAuth;
    this._fs = fissionAuth.fs;

    this._profiles = new Profiles(this._fs);
    this._keys = new Keys(this._fs);
    this._tokens = new Tokens(this._fs);
    this._values = new Aggregates(this._fs);
    // this._events = new EventStore<CacheEvent>(this._fs, ["eventStore"]);

    const circlesHub = new CirclesHub(config.getCurrent().web3(), config.getCurrent().HUB_ADDRESS);
    const query = CirclesHub.queryPastTrusts("0xDE374ece6fA50e781E81Aac78e811b33D16912c7", undefined);
    const source = circlesHub.queryEvents(query);
    /*
      this._events.attachEventSource(
        "trusts",
        source,
        (store, source, event) => {
          return <CacheEvent>{
            blockNo: event.blockNumber.toNumber(),
            blockHash: event.blockHash,
            data: JSON.stringify(event.returnValues),
            eventType: event.event,
            senderRef: event.address,
            senderType: "contract",
            source: source,
            valueInWei: "0"
          };
        });

      setTimeout(async () => {
        const cid = await this._events.flush();
        console.log("comitted cid:", cid);
      }, 10000)
     */
  }
}
