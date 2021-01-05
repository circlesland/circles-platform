import { ProcessArtifact } from "../interfaces/processArtifact";

export const textLine = (key: string, label?: string, isReadonly?: boolean, isOptional?: boolean) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "string",
    isReadonly: isReadonly,
    isOptional: isOptional,
    label: label
  };
  const part = {};
  part[key] = artifact;
  return part;
};
