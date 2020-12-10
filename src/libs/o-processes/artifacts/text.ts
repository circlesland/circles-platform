import { ProcessArtifact } from "../interfaces/processArtifact";

export const text = (key: string, label?: string, isReadonly?: boolean, isOptional?: boolean) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "text",
    isReadonly: isReadonly,
    isOptional: isOptional,
    label: label
  };
  const part = {};
  part[key] = artifact;
  return part;
};
