import {ProcessArtifact} from "../interfaces/processArtifact";

export const textLine = (key:string, label?:string, isReadonly?:boolean) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "string",
    isReadonly: isReadonly,
    label: label
  };
  const part = {};
  part[key] = artifact;
  return part;
};
