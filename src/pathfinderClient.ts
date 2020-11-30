export async function initPathFinder() {
  const registration = await navigator.serviceWorker.register("pathfinderWorker.js");
  if (registration.installing) {
    // Installing..
    console.log("inner worker: Installing")
  } else if (registration.waiting) {
    // Installed the service worker but still waiting
    // for activation (a previously installed service worker is still running)
    console.log("inner worker: Installed the service worker but still waiting")
  } else if (registration.active) {
    // Re-used the same service worker
    console.log("inner worker: Re-used the same service worker")
    setTimeout(() => {
    registration.active.postMessage({
      call: "findPath",
      args: {
        from: "0x9B74661e83F6696AdF872576f886Dc5Eb569B0bD",
        to: "0x3eb2b2D6e85ae3012a1c7ee727bd8F477b42F032",
        value: "0"
      }
    })}, 10000);
  }



  return Promise.resolve();
}
