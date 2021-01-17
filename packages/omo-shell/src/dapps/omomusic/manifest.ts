import {faHeadphones} from "@fortawesome/free-solid-svg-icons";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";

export interface OmoMusicState {}
export const omomusic : DappManifest<OmoMusicState> = {
  dappId: "omo.music:1",
  isSingleton: true,
  dependencies: [],
  isHidden: false,
  icon: faHeadphones,
  title: "Musik",
  routeParts: ["omoli"],
  tag: Promise.resolve("soon"),
  isEnabled: false,
  pages: []
};
