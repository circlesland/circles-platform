export class DelayedTrigger
{
  readonly delay:number;

  private readonly action:()=>Promise<void>;

  private lastTrigger:number;
  private isRunning:boolean;

  constructor(delay:number, action:()=>Promise<void>)
  {
    this.delay = delay;
    this.action = action;
  }

  trigger()
  {
    this.lastTrigger = Date.now();
    if (this.isRunning)
    {
      return;
    }

    this.isRunning = true;

    setTimeout(async () =>
    {
      if (this.lastTrigger + this.delay <= Date.now())
      {
        await this.action();
        this.isRunning = false;
      }
      else
      {
        this.isRunning = false;
        this.trigger();
      }
    }, this.delay);
  }
}
