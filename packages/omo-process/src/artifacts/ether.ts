import { ProcessArtifact } from "../interfaces/processArtifact";

export const ether = (key: string, label?: string, isReadonly?: boolean, maxAmount?: number) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "ether",
    isReadonly: isReadonly,
    max: maxAmount,
    label: label
  };
  const part:{
    [key:string]:ProcessArtifact
  } = {};
  part[key] = artifact;
  return part;
};
