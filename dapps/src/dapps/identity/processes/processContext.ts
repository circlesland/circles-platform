import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {ProcessEnvironment} from "omo-process/dist/interfaces/processEnvironment";

export interface ProcessContextCapability {
  /**
   * Executes the capability and returns the result when done.
   * @param data The optional input arguments
   */
  run<In extends {[p: string]: unknown}, Out>(data?:In): Promise<{
    error: Error,
    result: any
  }>;
}

export class ProcessContextWithCapabilities implements ProcessContext {
  data: { [p: string]: ProcessArtifact | undefined };
  environment: ProcessEnvironment;
  capabilities: { [p: string]: ProcessContextCapability }
}

export class ProcessContext extends ProcessContextWithCapabilities {
  data: { [p: string]: ProcessArtifact | undefined };
  environment: ProcessEnvironment;
}