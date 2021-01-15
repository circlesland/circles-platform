import { ProcessArtifact } from "../interfaces/processArtifact";

export const location = (key: string, label?: string, isReadonly?: boolean, isOptional?: boolean) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "location",
    isReadonly: isReadonly,
    isOptional: isOptional,
    label: label
  };
  const part = {};
  part[key] = artifact;
  return part;
};
