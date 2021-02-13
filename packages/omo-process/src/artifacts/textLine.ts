import { ProcessArtifact } from "../interfaces/processArtifact";

export const textLine = (key: string, label?: string, isReadonly?: boolean, isOptional?: boolean, value?:any) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "string",
    isReadonly: isReadonly,
    isOptional: isOptional,
    label: label,
    value: value
  };
  const part:{
    [key:string]:ProcessArtifact
  } = {};
  part[key] = artifact;
  return part;
};
