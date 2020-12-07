import { OmoEvent } from "./omoEvent";
import { OmoEventTypes } from "./eventTypes";

// TODO: Get these names/ids from a dapp manifest or similar
export type RefreshableViews =
  'safe.account'
  | 'safe.balance'
  | 'safe.friends'
  | 'safe.tokens'
  | 'safe.transactions'
  | 'omosapien.profile';

export class RefreshView implements OmoEvent {
  type: OmoEventTypes = "shell.refreshView";

  view: RefreshableViews;

  constructor(view: RefreshableViews) {
    this.view = view;
  }
}
