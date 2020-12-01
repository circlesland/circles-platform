import {ProcessEnvironment} from "./processEnvironment";
import {ProcessResult} from "./processResult";
import {ProcessArtifact} from "./processArtifact";
import {Profile} from "../../o-fission/entities/profile";

/**
 * Every running process has a context that stores the state
 * and provides access to the environment.
 * When a process ends it must set the 'result' property of the context
 * and one of its sub-fields (success or error).
 * The 'data' property is used to store any process artifacts like
 * user input or api responses.
 */
export interface ProcessContext
{
  environment: ProcessEnvironment,
  result?: ProcessResult,
  data: {
    [key: string]: ProcessArtifact|undefined
  }
}
