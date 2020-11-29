import {ProcessArtifact} from "../interfaces/processArtifact";

export const ether = (key:string, label?:string, isReadonly?:boolean) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "ether",
    isReadonly: isReadonly,
    label: label
  };
  const part = {};
  part[key] = artifact;
  return part;
};
