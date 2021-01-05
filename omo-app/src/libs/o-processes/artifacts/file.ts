import { ProcessArtifact } from "../interfaces/processArtifact";

export const file = (key: string, label?: string, isReadonly?: boolean, isOptional?: boolean) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "file",
    isReadonly: isReadonly,
    isOptional: isOptional,
    label: label
  };
  const part = {};
  part[key] = artifact;
  return part;
};
