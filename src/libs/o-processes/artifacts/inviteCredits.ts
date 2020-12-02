import {ProcessArtifact} from "../interfaces/processArtifact";

export const inviteCredits = (key:string, label?:string) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "inviteCredits",
    isReadonly: true,
    label: label
  };
  const part = {};
  part[key] = artifact;
  return part;
};
