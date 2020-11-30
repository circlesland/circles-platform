import {TransferCirclesContext} from "../transferCircles";
import {config} from "../../../../../libs/o-circles-protocol/config";
import {BN} from "ethereumjs-util";

function sendMessage(message)
{
  // This wraps the message posting/response in a promise, which will resolve if the response doesn't
  // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
  // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
  // a convenient wrapper.
  return new Promise(function (resolve, reject)
  {
    var messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = function (event)
    {
      if (event.data.error)
      {
        reject(event.data.error);
      }
      else
      {
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

const flow = {
  "flow": "205241203703692309155",
  "transfers": [{
    "from": "0xDE374ece6fA50e781E81Aac78e811b33D16912c7",
    "to": "0x42cEDde51198D1773590311E2A340DC06B24cB37",
    "token": "0x6b35C6Da733836BE97ceD8627C3747824450926b",
    "tokenOwner": "0xDE374ece6fA50e781E81Aac78e811b33D16912c7",
    "value": "12612499999994609166"
  }, {
    "from": "0xDE374ece6fA50e781E81Aac78e811b33D16912c7",
    "to": "0x9a0bbbbd3789f184CA88f2F6A40F42406cb842AC",
    "token": "0x6b35C6Da733836BE97ceD8627C3747824450926b",
    "tokenOwner": "0xDE374ece6fA50e781E81Aac78e811b33D16912c7",
    "value": "192628703703697699989"
  }, {
    "from": "0x42cEDde51198D1773590311E2A340DC06B24cB37",
    "to": "0x9a0bbbbd3789f184CA88f2F6A40F42406cb842AC",
    "token": "0x6293268785399bed001CB68A8Ee04d50DA9C854D",
    "tokenOwner": "0x42cEDde51198D1773590311E2A340DC06B24cB37",
    "value": "12612499999994609166"
  }]
}
export const transferCirclesService = async (context: TransferCirclesContext) =>
{
  try
  {
    const wei = config.getCurrent().web3().utils.toWei(context.data.value.value.toString(), "ether");
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
    const tokenOwners = [context.environment.safe.address];
    const sources = [context.environment.safe.address];
    const destinations = [context.data.recipient.value];
    const values = [wei];
/*
    (<any>pathResult).data.transfers.forEach(transfer =>
    {
      tokenOwners.push(transfer.tokenOwner);
      sources.push(transfer.from);
      destinations.push(transfer.to);
      values.push(transfer.value);
    });
*/
    const transferTroughResult = await context.environment.person.circlesHub.transferTrough(
      context.environment.account,
      context.environment.safe,
      tokenOwners,
      sources,
      destinations,
      values
    );

    console.log(transferTroughResult);
  } catch (e)
  {
    console.error(e);
    throw e;
  }
}
