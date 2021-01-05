import { ProcessArtifact } from "../interfaces/processArtifact";

export const ethereumAddress = (key: string, label?: string, isReadonly?: boolean) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "ethereumAddress",
    isReadonly: isReadonly,
    label: label
  };
  const part = {};
  part[key] = artifact;
  return part;
};
