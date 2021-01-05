var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class EventQuery {
    constructor(execute, events) {
        this.execute = execute;
        this.events = events;
    }
    pipe(pipe) {
        return new EventQuery(this.execute, pipe(this.events));
    }
    getLatest(groupBy) {
        return __awaiter(this, void 0, void 0, function* () {
            const aggregate = {};
            this.events.subscribe((event) => {
                const key = groupBy(event);
                const currentEvent = aggregate[key];
                if (currentEvent && currentEvent.blockNumber < event.blockNumber) {
                    aggregate[key] = event;
                }
                if (!currentEvent) {
                    aggregate[key] = event;
                }
            });
            yield this.execute();
            return aggregate;
        });
    }
    toArray(sortComparer) {
        return __awaiter(this, void 0, void 0, function* () {
            const events = [];
            const subscription = this.events.subscribe(event => {
                events.push(event);
            });
            yield this.execute();
            subscription.unsubscribe();
            if (sortComparer) {
                events.sort(sortComparer);
            }
            return events;
        });
    }
}
