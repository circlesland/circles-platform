import {IconDefinition} from "@fortawesome/fontawesome-common-types";
import {PageManifest} from "./pageManifest";
import {RuntimeDapp} from "./runtimeDapp";
import {DappState} from "./dappState";

export interface DappManifest<TState extends DappState>
{
  /**
   * A unique identifier for this dapp manifest.
   * This identifier is used as a namespace for all incoming and outgoing events of the dapp.
   */
  dappId: string,

  /**
   * If 'true' then the 'id' will be used as the 'runtimeId' of a RuntimeDapp
   */
  isSingleton: boolean;

  /**
   * If the dapp should be hidden in menus.
   */
  isHidden?: boolean,
  /**
   * This icon will be displayed in the dapp overview.
   */
  icon?: IconDefinition,
  /**
   * This title will be displayed as the dapp name.
   */
  title: string,

  /**
   * The route of the entry page of this dapp.
   */
  routeParts: string[],

  /**
   * Can be used to indicate a status in the dapp overview next to the icon.
   */
  tag: Promise<string|null|undefined>,
  /**
   * Can be used to indicate if this dapp is currently available in the dapp overview (greyed out or not)
   */
  isEnabled: boolean,

  /**
   * Contains all pages of the dapp.
   */
  pages: PageManifest[],

  /**
   * Dapps can depend on other dapps.
   * When a dapp depends on another dapp, then the dependent dapp cannot be initialized
   * before the dependency was initialized.
   */
  dependencies?: string[],

  /**
   * If the dapp needs to initialize things before it can be used,
   * then these steps must be performed in this factory.
   * @param runtimeDapp
   */
  initialize?: (stack:RuntimeDapp<TState>[], runtimeDapp: RuntimeDapp<TState>) => Promise<{
    initialPage: PageManifest,
    cancelDependencyLoading: boolean,
  }>
}
