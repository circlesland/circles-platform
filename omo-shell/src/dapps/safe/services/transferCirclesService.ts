import BN from "omo-quirks/dist/BN";
import {TransferCirclesContext} from "../processes/circles/transferCircles";
import {OmoSafeState} from "../manifest";
import {GnosisSafeProxy} from "omo-circles/dist/safe/gnosisSafeProxy";
import {CirclesTransaction} from "omo-models/dist/circles/circlesTransaction";
import {ProgressSignal} from "omo-events/dist/signals/progressSignal";
import {EndSignal} from "omo-events/dist/signals/endSignal";
import {tryGetDappState} from "omo-kernel/dist/kernel";
import {TransitivePath} from "./findTransitivePath";

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


export const transferCirclesService = async (context: TransferCirclesContext) =>
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  const web3 = context.web3;
  const ownerAddress = context.web3
    .eth
    .accounts
    .privateKeyToAccount(safeState.myKey.privateKey)
    .address;

  const gnosisSafeProxy = new GnosisSafeProxy(web3, ownerAddress, safeState.mySafeAddress);

  try {
    const circlesValueInWei = context.web3.utils
      .toWei(context.data.value.value.toString(), "ether")
      .toString();
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

    window.o.logger.log(pathResult);
    const tokenOwners = [safeState.mySafeAddress];
    const sources = [safeState.mySafeAddress];
    const destinations = [context.data.recipient.value];
    const values = [oValueInWei];
*/
    const tokenOwners = [];
    const sources = [];
    const destinations = [];
    const values = [];

    const path = <TransitivePath>context.data.pathToRecipient.value;
    path.transfers.forEach(transfer =>
    {
      tokenOwners.push(transfer.tokenOwner);
      sources.push(transfer.from);
      destinations.push(transfer.to);
      values.push(new BN(transfer.value));
    });

    const dummyTransaction:CirclesTransaction = {
      from: safeState.mySafeAddress,
      to: context.data.recipient.value,
      direction: "out",
      amount: oValueInWei,
      token: safeState.myToken.tokenAddress,
      timestamp: Date.now() / 1000,
      tokenOwner: safeState.mySafeAddress,
      type: "blockchain",
      subject: "",
      blockNo: 0,
      cached: false,
      id: ""
    };

    let currentTransactionsList = safeState.myTransactions.getValue();
    safeState.myTransactions.next({
      signal: new ProgressSignal("", 0, dummyTransaction),
      payload: currentTransactionsList.payload
    });

    const transferTroughResult = await context.circlesHub.transferTrough(
      safeState.myKey.privateKey,
      gnosisSafeProxy,
      tokenOwners,
      sources,
      destinations,
      values
    );

    currentTransactionsList = safeState.myTransactions.getValue();
    safeState.myTransactions.next({
      signal: new EndSignal(),
      payload: currentTransactionsList.payload
    });

    window.o.logger.log(transferTroughResult);
  } catch (e) {
    console.error(e);
    throw e;
  }
}
