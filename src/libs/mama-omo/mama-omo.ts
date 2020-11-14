export class MamaOmo {
    private welcome: string;

    constructor(message: string) {
        this.welcome = message;
    }
    greetMe() {
        alert("Hello, " + this.welcome)
    }

}
