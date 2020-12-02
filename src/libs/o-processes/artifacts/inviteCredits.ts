import {ProcessArtifact} from "../interfaces/processArtifact";

export const inviteCredits = (key:string, label?:string, isReadonly?:boolean) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "inviteCredits",
    isReadonly: isReadonly,
    label: label
  };
  const part = {};
  part[key] = artifact;
  return part;
};
