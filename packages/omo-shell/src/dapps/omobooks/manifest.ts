import {faBook} from "@fortawesome/free-solid-svg-icons";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";

export interface OmoBooksState {}
export const omobooks : DappManifest<OmoBooksState,OmoBooksState> = {
  id: "omo.books:1",
  isSingleton: true,
  dependencies: [],
  isHidden: false,
  icon: faBook,
  title: "Books",
  routeParts: ["omoli"],
  tag: Promise.resolve("soon"),
  isEnabled: false,
  pages: []
};
