var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class DelayedTrigger {
    constructor(delay, action) {
        this.delay = delay;
        this.action = action;
    }
    trigger() {
        this.lastTrigger = Date.now();
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            if (this.lastTrigger + this.delay <= Date.now()) {
                yield this.action();
                this.isRunning = false;
            }
            else {
                this.isRunning = false;
                this.trigger();
            }
        }), this.delay);
    }
}
