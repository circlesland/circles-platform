import { ProcessContext } from "../interfaces/processContext";
import { assign } from "xstate";
import { Continue } from "../events/continue";

/**
 * Inspects the received 'process.continue' event and gets all changed ProcessArtifacts.
 * Then it overwrites all changed artifacts on the context with the one from the continue event.
 */
export const storePromptResponse = assign((context: ProcessContext, event) => {
  if (event.type != "process.continue") {
    throw new Error("The 'storePromptResponse' action received an event of type '" + event.type + "' but it supports only 'process.continue' events.");
  }

  // Cast to Continue event and filter all changed ProcessArtifacts
  const continueEvent = <Continue>event;
  if (continueEvent.data) {
      const changes = Object.keys(continueEvent.data)
      // @ts-ignore
      .map(key => continueEvent.data[key])
      .filter(artifact => artifact.changed);

    // Delete all values that already exist on the context's data property
    const existingData = context.data;
    changes.forEach(artifact => delete existingData[artifact.key]);

    // Write a new 'data' object with only the changed artifacts.
    const changedData = {};
    // @ts-ignore
      changes.forEach(artifact => changedData[artifact.key] = artifact);

    // Merge the new and unchanged artifacts and set the 'data' property
    context.data = {
      ...existingData,
      ...changedData
    };
  }
  return context;
});
