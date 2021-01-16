import { ProcessArtifact } from "../interfaces/processArtifact";

export const o = (key: string, label?: string, isReadonly?: boolean, maxAmount?: number) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "o",
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
