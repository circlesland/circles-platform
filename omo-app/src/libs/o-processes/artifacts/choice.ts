import { ProcessArtifact } from "../interfaces/processArtifact";

export const choice = (key: string, label: string | undefined, choices: any[]) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "choice",
    isReadonly: false,
    label: label,
    choices: choices,
    isValid: true
  };
  const part = {};
  part[key] = artifact;
  return part;
};
