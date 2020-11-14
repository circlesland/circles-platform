export class SpanishMamaOmo {
    private welcome: string;

    constructor(message: string) {
        this.welcome = message;
    }
    greetMe() {
        alert("Hola, " + this.welcome)
    }
}

