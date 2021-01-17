import {Kernel as KernelInterface} from "omo-kernel-interfaces/dist/kernel"
import {RuntimeDapp} from "omo-kernel-interfaces/dist/runtimeDapp";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";
import {DappState} from "omo-kernel-interfaces/dist/dappState";
import {OmoBehaviorSubject} from "omo-quirks/dist/OmoBehaviorSubject";
import {Topic} from "omo-utils/dist/eventBroker";
import {Generate} from "omo-utils/dist/generate";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {StatePropagation} from "omo-kernel-interfaces/dist/statePropagation";
import {fission, FissionAuthState} from "omo-fission/dist/manifest";

class Kernel implements KernelInterface
{
    private readonly _runtimeDapps: {
        [id: string]: RuntimeDapp<any>
    } = {};

    async boot()
    {
        await this.load<FissionAuthState>(fission, async (id:string) => {
           return <FissionAuthState>{}
        });
    }

    async load<TState extends DappState>(dappManifest: DappManifest<TState>, stateFactory:(runtimeDappId:string) => Promise<TState>)
        : Promise<RuntimeDapp<TState>>
    {
        const runtimeDappId = dappManifest.isSingleton
            ? dappManifest.dappId
            : dappManifest.dappId + ":" + Generate.randomHexString();

        if (this._runtimeDapps[runtimeDappId])
        {
            throw new Error(`'${runtimeDappId}' is already running.`)
        }

        const initialState = await stateFactory(runtimeDappId);

        const stateSubject = new OmoBehaviorSubject<StatePropagation<TState>>(initialState);
        const inEventsTopic = new Topic<OmoEvent>(runtimeDappId, "in");
        const outEventsTopic = new Topic<OmoEvent>(runtimeDappId, "out");

        const runtimeDapp:RuntimeDapp<TState> = {
            dappId: dappManifest.dappId,
            runtimeId: runtimeDappId,
            route: dappManifest.routeParts.join("/"),
            state: stateSubject,
            inEvents: inEventsTopic,
            outEvents: outEventsTopic,
            isSingleton: dappManifest.isSingleton,
            initialize: dappManifest.initialize,
            pages: dappManifest.pages,
            dependencies: dappManifest.dependencies,
            isHidden: dappManifest.isHidden,
            icon: dappManifest.icon,
            tag: dappManifest.tag,
            title: dappManifest.title,
            routeParts: dappManifest.routeParts,
            isEnabled: dappManifest.isEnabled,
            emitState: state => {
                const currentState = stateSubject.getValue();
                stateSubject.next({
                    payload: state,
                    signal: currentState.signal
                })
            },
            emitSignal: signal => {
                const currentState = stateSubject.getValue();
                stateSubject.next({
                    payload: currentState.payload,
                    signal: signal
                })
            },
        };

        this._runtimeDapps[runtimeDapp.runtimeId] = runtimeDapp;
        return runtimeDapp;
    }

    async connect<TState extends DappState>(runtimeId: string): Promise<RuntimeDapp<TState>>
    {
        return this._runtimeDapps[runtimeId];
    }

    async unload(runtimeId: string): Promise<void>
    {
        throw new Error("Not implemented");
    }
}

export const kernel = new Kernel();
