export async function initPathFinder() {
  const registration = await navigator.serviceWorker.register("pathfinderWorker.js");

  registration.addEventListener("message", msg => {
    window.o.logger.log("Response:", msg);
  });

  if (registration.installing) {
    // Installing..
    window.o.logger.log("inner worker: Installing")
  } else if (registration.waiting) {
    // Installed the service worker but still waiting
    // for activation (a previously installed service worker is still running)
    window.o.logger.log("inner worker: Installed the service worker but still waiting")
  } else if (registration.active) {
    // Re-used the same service worker
    window.o.logger.log("inner worker: Re-used the same service worker")

  }

  return Promise.resolve();
}

function sendMessage(message) {
  // This wraps the message posting/response in a promise, which will resolve if the response doesn't
  // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
  // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
  // a convenient wrapper.
  return new Promise(function (resolve, reject) {
    var messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = function (event) {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };

    // This sends the message data as well as transferring messageChannel.port2 to the service worker.
    // The service worker can then use the transferred port to reply via postMessage(), which
    // will in turn trigger the onmessage handler on messageChannel.port1.
    // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
    navigator.serviceWorker.controller.postMessage(message,
      [messageChannel.port2]);
  });
}
