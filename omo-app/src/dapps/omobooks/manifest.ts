import {faBook} from "@fortawesome/free-solid-svg-icons";
import {DappManifest} from "../../libs/o-os/interfaces/dappManifest";

export interface OmoBooksState {}
export const omobooks : DappManifest<OmoBooksState,OmoBooksState> = {
  id: "omo.books:1",
  dependencies: [],
  isHidden: false,
  icon: faBook,
  title: "Books",
  routeParts: ["omoli"],
  tag: Promise.resolve("soon"),
  isEnabled: false,
  pages: []
};
