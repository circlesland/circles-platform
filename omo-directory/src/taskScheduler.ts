import {ScheduledTask} from "./scheduledTask";
import {Slot} from "./slot";
import {DistributingTaskExecutor} from "./distributingTaskExecutor";

export const TaskSchedulerSlotLength = 5000;

export class TaskScheduler
{
    readonly tasks:{
        [fissionName:string]: ScheduledTask
    } = {};

    readonly slots: {
        [endsAt:number]: Slot
    } = {};

    private _tickInterval?:NodeJS.Timeout;
    private _isBusy:boolean = false;
    private _currentSlot:number = 0;

    addOrResetTask(id:string, executeNTimes:number, action:() => Promise<void>)
    {
        // If there is already a running task then just reset the executions left.
        // In the worst case someone could keep a task per account indefinitely
        // by repeatedly calling POST /signup.
        if (this.tasks[id])
        {
            console.log("Resetting 'executionsLeft' of '" + id + "' to " + executeNTimes);
            this.tasks[id].resetExecutions();
            return;
        }

        console.log("Adding new task for '" + id + "' with " + executeNTimes + " executions");
        const newTask = new ScheduledTask(id, executeNTimes, action);
        this.tasks[id] = newTask;

        this.scheduleTask(newTask);
    }

    start()
    {
        this._tickInterval = setInterval(() => {
            this.tick();
        }, 1000);
    }

    stop()
    {
        if (this._tickInterval)
        {
            clearInterval(this._tickInterval);
            this._tickInterval = undefined;
        }
    }

    taskEnded(task:ScheduledTask)
    {
        delete this.tasks[task.id];
    }

    scheduleTask(task:ScheduledTask)
    {
        // Schedule the task to run in the next interval
        const now = Date.now();
        const slotStartsAt = now - (now % TaskSchedulerSlotLength) + TaskSchedulerSlotLength;
        const slotEndsAt = now - (now % TaskSchedulerSlotLength) + (TaskSchedulerSlotLength * 2);

        const slot = this.slots[slotEndsAt]
            ? this.slots[slotEndsAt]
            : {
                startsAt: slotStartsAt,
                endsAt: slotEndsAt,
                tasks: {}
            };

        // console.log("Scheduling task '" + task.id + "' for slot: " + slot.endsAt);

        let taskArr = Object.values(slot.tasks);
        taskArr.push(task);
        taskArr = this.shuffleArray(taskArr);
        taskArr.forEach(o => {
            slot.tasks[o.id] = o;
        });

        this.slots[slotEndsAt] = slot;
    }

    private async tick()
    {
        const now = Date.now();
        const slotEndsAt = now - (now % TaskSchedulerSlotLength) + TaskSchedulerSlotLength;
        if (this._currentSlot != slotEndsAt)
        {
            this._currentSlot = slotEndsAt;
            console.log(`TaskScheduler.tick() - Current slot: '${this._currentSlot}'`);
        }

        if (this._isBusy)
        {
            return;
        }

        const oldSlots = Object.keys(this.slots).filter(slotEndsAt => slotEndsAt < slotEndsAt);
        if (oldSlots.length > 0)
        {
            console.warn("Found old slots that will be dropped without execution:", oldSlots);
            oldSlots.forEach(oldSlot => delete this.slots[parseInt(oldSlot)]);
            console.log("Dropped " + oldSlots.length + " old slots.")
        }

        const slot = this.slots[slotEndsAt];
        if (!slot)
        {
            return;
        }

        this._isBusy = true;

        // console.log("Start processing slot " + slot.endsAt);

        const currentSlot = this.slots[slotEndsAt];
        delete this.slots[slotEndsAt];

        const executor = new DistributingTaskExecutor(this);
        await executor.execute(currentSlot);

        this._isBusy = false;
    }

    private shuffleArray(array:Array<any>)
    {
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}
