import type { Observable } from "rxjs";

export class EventQuery<TItem>
{
  readonly execute: () => Promise<number>;
  readonly events: Observable<TItem & { blockNumber: number }>

  constructor(execute: () => Promise<number>, events: Observable<TItem & { blockNumber: number }>) {
    this.execute = execute;
    this.events = events;
  }

  pipe<TResult>(pipe: (events: Observable<TItem & { blockNumber: number }>) => Observable<TResult & { blockNumber: number }>): EventQuery<TResult & { blockNumber: number }> {
    return new EventQuery<TResult & { blockNumber: number }>(this.execute, pipe(this.events));
  }

  async getLatest(groupBy: (e: TItem & { blockNumber: number }) => string) {
    const aggregate: { [key: string]: TItem & { blockNumber: number } } = {};

    this.events.subscribe((event: TItem & { blockNumber: number }) => {
      const key = groupBy(event);
      const currentEvent = aggregate[key];
      if (currentEvent && currentEvent.blockNumber < event.blockNumber) {
        aggregate[key] = event;
      }
      if (!currentEvent) {
        aggregate[key] = event;
      }
    });

    await this.execute();

    return aggregate;
  }

  async toArray(sortComparer?: (a: TItem, b: TItem) => -1 | 0 | 1): Promise<TItem[]> {
    const events: TItem[] = [];
    const subscription = this.events.subscribe(event => {
      events.push(event);
    });
    await this.execute();
    subscription.unsubscribe();
    if (sortComparer) {
      events.sort(sortComparer);
    }

    return events;
  }
}
