export class Signal {
}
export class BeginSignal {
    constructor(key) {
        this.type = "shell.begin";
        this.key = key;
    }
}
export class ProgressSignal {
    constructor(key, message, percent, dummy) {
        this.type = "shell.progress";
        this.key = key;
        this.message = message;
        this.percent = percent;
        this.dummy = dummy;
    }
}
export class EndSignal {
    constructor(key) {
        this.type = "shell.done";
        this.key = key;
    }
}
