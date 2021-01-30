
export class ScheduledTask
{
    readonly id: string;
    readonly action:() => Promise<void>;
    readonly executeNTimes:number
    readonly attempts: {
        started: number,
        finished?: number,
        error?: string
    }[] = [];

    private _executionsLeft:number;

    constructor(id:string, executeNTimes:number, action:() => Promise<void>)
    {
        this.id = id;
        this.executeNTimes = executeNTimes;
        this._executionsLeft = executeNTimes;
        this.action = action;
    }

    get executionsLeft() :number
    {
        return this._executionsLeft;
    };

    resetExecutions()
    {
        this._executionsLeft = this.executeNTimes;
    }

    async execute()
    {
        if (this.executionsLeft < 1)
        {
            throw new Error("The task was already executed " + this.attempts.length + " times and has no executions left.");
        }
        try
        {
            await this.action();
        }
        catch (e)
        {
            throw e;
        }
        finally
        {
            this._executionsLeft--;
        }
    }
}
