import {Logger} from "omo-utils/dist/logger";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {OmoSubject} from "omo-quirks/dist/OmoSubject";
import {Process} from "omo-process/dist/interfaces/process";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import ApolloClient, {DefaultOptions} from "apollo-client";
import {NormalizedCacheObject} from "apollo-cache-inmemory";

export interface Shell {
  contactUsername?: string;
  graphQLClient?: ApolloClient<NormalizedCacheObject>,
  lastError?: any;
  redirectTo?: string;
  events?: OmoSubject<OmoEvent>,
  publishEvent?: (event: OmoEvent) => void,
  logger: Logger,
  stateMachines: {
    current(): Process | null,
    cancel(),
    run: (definition: ProcessDefinition<any, any>, contextModifier?: (processContext: ProcessContext) => Promise<ProcessContext>) => Process
  }
}
