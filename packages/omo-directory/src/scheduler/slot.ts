import {ScheduledTask} from "./scheduledTask";

export type Slot = {
    startsAt: number;
    endsAt: number;
    tasks: {
        [id:string]: ScheduledTask
    }
};
