import {TaskScheduler} from "./taskScheduler";
import {Slot} from "./slot";
import {ScheduledTask} from "./scheduledTask";

export class DistributingTaskExecutor
{
    readonly scheduler:TaskScheduler;

    constructor(scheduler:TaskScheduler)
    {
        this.scheduler = scheduler;
    }

    async execute(slot:Slot)
    {
        const tasksInSlot = Object.values(slot.tasks);
        const executedTasksArr:ScheduledTask[] = [];

        let executedTasks:number = 0;
        let failedTasks:number = 0;
        let endedTasks:number = 0;

        const interval = (slot.endsAt - slot.startsAt) / tasksInSlot.length;
        let distance = 0;

        const points = [];

        for(let task of tasksInSlot)
        {
            setTimeout(async () =>
            {
                const attempt: {
                    started: number;
                    finished?: number;
                    error?: any
                } = {
                    started: Date.now()
                };

                try
                {
                    await task.execute();
                    attempt.finished = Date.now();
                    executedTasks++;
                }
                catch(e)
                {
                    console.log("<- An error occurred during the execution of '" + task.id + "':", e);
                    attempt.finished = Date.now();
                    attempt.error = e;
                    failedTasks++;
                }

                if (attempt.finished > slot.endsAt)
                {
                    console.warn(`Task '${task.id}' finished ${attempt.finished - slot.endsAt} ms after it's slot (${slot.endsAt}) ended.`)
                }

                task.attempts.push(attempt);
                executedTasksArr.push(task);

                if (task.executionsLeft > 0)
                {
                    this.scheduler.scheduleTask(task);
                }
                else
                {
                    endedTasks++;
                    this.scheduler.taskEnded(task);
                }
            }, distance);

            points.push(distance);
            distance += interval;
        }

        console.log("Schedule:", points)

        const slotCopy = JSON.parse(JSON.stringify(slot));
        setTimeout(() =>
        {
            executedTasksArr.forEach(executedTask => delete slotCopy.tasks[executedTask.id]);
            const startedAndStillRunning = Object.keys(slotCopy.tasks);

            console.log(``);
            console.log(`=================================================`);
            console.log(`===         Slot '${slot.endsAt}' ended        ===`);
            console.log(`=================================================`);
            console.log(``);
            console.log(` Slot statistics:`);
            console.log(` ----------------`);
            console.log(` * scheduled:  ${tasksInSlot.length}`);
            console.log(` * missed:     ${tasksInSlot.length - executedTasksArr.length}`);
            console.log(` * executed:   ${executedTasksArr.length}`);
            console.log(`   .. error:   ${failedTasks}`);
            console.log(`   .. success: ${executedTasks}`);
            console.log(`   .. ended:   ${endedTasks}`);
            console.log(` `);
            console.log(` Missed Tasks (started but not finished):`);
            console.log(` ----------------------------------------`);
            let stats = startedAndStillRunning
                .map(missedTaskId => slot.tasks[missedTaskId])
                .map(executedTask => this.getTaskStats(executedTask));
            if (startedAndStillRunning.length == 0)
            {
                console.log(`    --- `);
            }
            else
            {
                stats.forEach(taskStats =>
                {
                    console.log(` * ${taskStats.id} (${taskStats.totalExecutionCount} executions so far; ${slot.tasks[taskStats.id].executionsLeft} executions left)`);
                    console.log(`   .. last: ${taskStats.lastExecutionTime} ms`);
                    console.log(`   .. min:  ${taskStats.minExecutionTime} ms`);
                    console.log(`   .. max:  ${taskStats.maxExecutionTime} ms`);
                    console.log(`   .. avg:  ${taskStats.avgExecutiontime} ms`);
                    console.log(``);
                });
            }
            console.log(` `);
            console.log(` Executed tasks:`);
            console.log(` -------------`);
            stats = executedTasksArr.map(executedTask => this.getTaskStats(executedTask));
            stats.forEach(taskStats =>
            {
                console.log(` * ${taskStats.id} (${taskStats.totalExecutionCount} executions so far; ${slot.tasks[taskStats.id].executionsLeft} executions left)`);
                console.log(`   .. last: ${taskStats.lastExecutionTime} ms`);
                console.log(`   .. min:  ${taskStats.minExecutionTime} ms`);
                console.log(`   .. max:  ${taskStats.maxExecutionTime} ms`);
                console.log(`   .. avg:  ${taskStats.avgExecutiontime} ms`);
                console.log(``);
            });
            console.log(``);
        }, slot.endsAt - Date.now());
    }

    private getTaskStats(executedTask: ScheduledTask)
    {
        const lastAttempt = executedTask.attempts[executedTask.attempts.length - 1];
        if (!lastAttempt)
        {
            return {
                id: executedTask.id,
                totalExecutionCount: 0,
                lastExecutionTime: -1,
                minExecutionTime: -1,
                maxExecutionTime: -1,
                avgExecutiontime: -1
            }
        }

        const lastExecutionTime = (lastAttempt.finished ?? 0) - lastAttempt.started;
        const executionStats = executedTask.attempts.reduce((p, c) =>
        {
            const executionTime = (c.finished ?? 0) - c.started;
            p.maxExecutionTime = executionTime > p.maxExecutionTime ? executionTime : p.maxExecutionTime;
            p.minExecutionTime = executionTime < p.minExecutionTime ? executionTime : p.minExecutionTime;
            p.totalExecutionTime += executionTime;
            p.totalExecutionCount++;

            return p;
        }, {
            minExecutionTime: Number.MAX_SAFE_INTEGER,
            maxExecutionTime: Number.MIN_SAFE_INTEGER,
            totalExecutionTime: 0,
            totalExecutionCount: 0
        });

        return {
            id: executedTask.id,
            lastExecutionTime,
            minExecutionTime: executionStats.minExecutionTime,
            maxExecutionTime: executionStats.maxExecutionTime,
            avgExecutiontime: executionStats.totalExecutionTime / executionStats.totalExecutionCount,
            totalExecutionCount: executionStats.totalExecutionCount
        }
    }
}
