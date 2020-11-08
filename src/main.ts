import App from "./App.svelte";

(<any>window).stateMachines = {
  start:(factory:() => {state, send, service}) => {
    const sm =  factory();
    return 0;
  },
  get:(id:number) => {
    return null;
  }
};

const app = new App({
  target: document.body,
});

export default app;
