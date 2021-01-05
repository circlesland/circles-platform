/**
 * Can be used as a generic trigger event or as response to a 'Prompt'.
 */
export class Continue {
    constructor() {
        this.type = "process.continue";
    }
}
