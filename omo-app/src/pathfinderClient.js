var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function initPathFinder() {
    return __awaiter(this, void 0, void 0, function* () {
        const registration = yield navigator.serviceWorker.register("pathfinderWorker.js");
        registration.addEventListener("message", msg => {
            console.log("Response:", msg);
        });
        if (registration.installing) {
            // Installing..
            console.log("inner worker: Installing");
        }
        else if (registration.waiting) {
            // Installed the service worker but still waiting
            // for activation (a previously installed service worker is still running)
            console.log("inner worker: Installed the service worker but still waiting");
        }
        else if (registration.active) {
            // Re-used the same service worker
            console.log("inner worker: Re-used the same service worker");
        }
        return Promise.resolve();
    });
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
            }
            else {
                resolve(event.data);
            }
        };
        // This sends the message data as well as transferring messageChannel.port2 to the service worker.
        // The service worker can then use the transferred port to reply via postMessage(), which
        // will in turn trigger the onmessage handler on messageChannel.port1.
        // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
        navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
    });
}
