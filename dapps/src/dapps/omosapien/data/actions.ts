import {faUserCircle, faUserAstronaut, faKey, faCoins, faUsers} from "@fortawesome/free-solid-svg-icons";
import {updateOmoSapien, UpdateOmoSapienContext} from "../processes/updateOmoSapien/updateOmoSapien";
import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";
import {RunProcess} from "omo-process/dist/events/runProcess";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";

export const omoSapienDefaultActions: QuickAction[] = [
  {
    type: "route",
    pos: "1",
    mapping: {
      design: {
        icon: faUserAstronaut
      },
      data: {
        label: "Me"
      }
    },
    route: "#/omosapien/me"
  }, {
    type: "route",
    pos: "2",
    mapping: {
      design: {
        icon: faUsers,
      },
      data: {
        label: "Profiles"
      }
    },
    route: "#/omosapien/profiles"
  }, {
    type: "route",
    pos: "3",
    mapping: {
      design: {
        icon: faKey,
      },
      data: {
        label: "Keys",
      }
    },
    route: "#/omosapien/keys"
  }, {
    type: "route",
    pos: "4",
    mapping: {
      design: {
        icon: faUserCircle,
      },
      data: {
        label: "Home",
      }
    },
    route: "#/omoli/dapps"
  }
];

export const omoSapienOverflowActions: QuickAction[] = [{
  type: "trigger",
  pos: "overflow",
  mapping: {
    design: {
      icon: faCoins,
    },
    data: {
      label: "Update Profile",
    }
  },
  event: () => new RunProcess<UpdateOmoSapienContext>(updateOmoSapien, async (ctx) => {
    await runWithDrive(async fissionDrive => {
      const existingProfile = await fissionDrive.profiles.tryGetMyProfile();
      if (!existingProfile) {
        return;
      }
      ctx.data.firstName = <ProcessArtifact>{
        key: "firstName",
        type: "string",
        value: existingProfile.firstName
      };
      ctx.data.lastName = <ProcessArtifact>{
        key: "lastName",
        type: "string",
        value: existingProfile.lastName
      };
      const myAvatar = await fissionDrive.profiles.tryGetMyAvatarAsBuffer();
      ctx.data.avatar = <ProcessArtifact>{
        key: "lastName",
        type: "string",
        value: myAvatar
      };
    });
    return ctx;
  })
}];
