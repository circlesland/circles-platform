export class ShowNotification {
    constructor(component, mapping) {
        this.type = "shell.showNotification";
        this.component = component;
        this.mapping = mapping;
    }
}
