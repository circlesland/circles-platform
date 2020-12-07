import { TransferCirclesContext } from "../transferCircles";
import { BN } from "ethereumjs-util";

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
    navigator.serviceWorker.controller.postMessage(message,
      [messageChannel.port2]);
  });
}


export const transferCirclesService = async (context: TransferCirclesContext) => {
  try {
    const circlesValueInWei = context.environment.eth.web3.utils
      .toWei(context.data.value.value.toString(), "ether");
    const oValueInWei = new BN(circlesValueInWei).div(new BN("3"));
    /*
    const pathResult = await sendMessage({
      call: "findPath",
      args: {
        from: context.environment.safe.address,
        to: context.data.recipient.value,
        value: wei
      }
    });

    console.log(pathResult);
*/
    const tokenOwners = [context.environment.me.mySafe.address];
    const sources = [context.environment.me.mySafe.address];
    const destinations = [context.data.recipient.value];
    const values = [oValueInWei];
    /*
        (<any>pathResult).data.transfers.forEach(transfer =>
        {
          tokenOwners.push(transfer.tokenOwner);
          sources.push(transfer.from);
          destinations.push(transfer.to);
          values.push(transfer.value);
        });
    */
    const transferTroughResult = await context.environment.eth.contracts.hub.transferTrough(
      context.environment.me.myKey.privateKey,
      context.environment.me.mySafe,
      tokenOwners,
      sources,
      destinations,
      values
    );

    console.log(transferTroughResult);
  } catch (e) {
    console.error(e);
    throw e;
  }
}
