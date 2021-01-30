import { ProcessArtifact } from "../interfaces/processArtifact";

export const keyphrase = (key: string, label?: string, isReadonly?: boolean) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "keyphrase",
    isReadonly: isReadonly,
    isOptional: false,
    label: label
  };
  const part:{
    [key:string]:ProcessArtifact
  } = {};
  part[key] = artifact;
  return part;
};
