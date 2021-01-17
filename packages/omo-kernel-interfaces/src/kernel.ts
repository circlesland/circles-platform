import {DappManifest} from "./dappManifest";
import {RuntimeDapp} from "./runtimeDapp";
import {DappState} from "./dappState";

export interface Kernel
{
    load<TState extends DappState>(dappManifest:DappManifest<TState>, stateFactory:() => Promise<TState>) : Promise<RuntimeDapp<TState>>
    connect<TState>(runtimeId:string) : Promise<RuntimeDapp<TState>>
    unload(runtimeId:string) : Promise<void>;
}
