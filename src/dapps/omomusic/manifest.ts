import {DappManifest} from "../../libs/o-os/interfaces/dappManifest";
import {faHeadphones} from "@fortawesome/free-solid-svg-icons";

export interface OmoMusicState {}
export const omomusic : DappManifest<OmoMusicState,OmoMusicState> = {
  id: "omo.music:1",
  dependencies: [],
  isHidden: false,
  icon: faHeadphones,
  title: "Musik",
  routeParts: ["omoli"],
  tag: Promise.resolve("soon"),
  isEnabled: false,
  pages: []
};
