export class RunProcess {
    constructor(definition, contextModifier) {
        this.type = "shell.runProcess";
        this.definition = definition;
        this.contextModifier = contextModifier;
    }
}
