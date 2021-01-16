import {DappManifest} from "./dappManifest";
import {RuntimeDapp} from "./runtimeDapp";

export interface Kernel
{
    load<TInternalState, TExternalState>(dappManifest:DappManifest<any, any>) : Promise<RuntimeDapp<TInternalState, TExternalState>>
    connect<TExternalState>(runtimeId:string) : Promise<RuntimeDapp<any, TExternalState>>
    unload(runtimeId:string) : Promise<void>;
}
