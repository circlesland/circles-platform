import { ProcessArtifact } from "../interfaces/processArtifact";
import BN from "omo-quirks/dist/BN";

export const o = (key: string, label?: string, isReadonly?: boolean, maxAmount?: number, value?:BN) => {
  const artifact = <ProcessArtifact>{
    key: key,
    type: "o",
    isReadonly: isReadonly,
    max: maxAmount,
    label: label,
    value: value
  };
  const part:{
    [key:string]:ProcessArtifact
  } = {};
  part[key] = artifact;
  return part;
};
