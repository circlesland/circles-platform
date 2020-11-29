import Profile from 'src/dapps/odentity/views/pages/Profile.svelte'
import Access from 'src/dapps/odentity/views/pages/Access.svelte'
import Authenticate from 'src/dapps/odentity/views/pages/Authenticate.svelte'
import Keys from 'src/dapps/odentity/views/pages/Keys.svelte'
import { ActionBarAction } from 'src/libs/o-os/routes';

import { odentityDefaultActions, odentityOverflowActions } from "./data/actions"

export const profile = {
  component: Profile,
  userData: {
    actions: <ActionBarAction[]>[
      ...odentityDefaultActions,
      ...odentityOverflowActions
    ]
  }
}

export const authenticate = {
  component: Authenticate,
  userData: {
    actions: <ActionBarAction[]>[
      ...odentityDefaultActions,
      ...odentityOverflowActions
    ]
  }
}

export const access = {
    component: Access,
    userData: {
        actions: <ActionBarAction[]>[
            ...odentityDefaultActions,
            ...odentityOverflowActions
        ]
    }
}

export const keys = {
    component: Keys,
    userData: {
        actions: <ActionBarAction[]>[
            ...odentityDefaultActions,
            ...odentityOverflowActions
        ]
    }
}
