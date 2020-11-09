import App from "./App.svelte";
import { Observable } from "rxjs";

(<any>window).stateMachines = {
  start: (factory: () => { state, send, service }) => {
    const sm = factory();
    return new Observable((observer) => {
      sm.service.onTransition(transition => {
        console.log("ON TRANSITION");
        observer.next(transition.meta);
      });
    });
  },
  get: (id: number) => {
    return null;
  }
};

const app = new App({
  target: document.body,
});

export default app;
