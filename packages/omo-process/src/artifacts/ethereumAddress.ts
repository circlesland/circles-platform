import { ProcessArtifact } from "../interfaces/processArtifact";

export const ethereumAddress = (key: string, label?: string, isReadonly?: boolean, enableAutocomplete?: boolean, value?:string) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "ethereumAddress",
    isReadonly: isReadonly,
    enableAutocomplete: enableAutocomplete,
    label: label,
    value: value
  };
  const part:{
    [key:string]:ProcessArtifact
  } = {};
  part[key] = artifact;
  return part;
};
