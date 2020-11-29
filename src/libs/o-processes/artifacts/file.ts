import {ProcessArtifact} from "../interfaces/processArtifact";

export const file = (key:string, label?:string, isReadonly?:boolean) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "file",
    isReadonly: isReadonly,
    label: label
  };
  const part = {};
  part[key] = artifact;
  return part;
};
