import {TransferCirclesContext} from "../processes/circles/transferCircles";
import {tryGetDappState} from "omo-kernel/dist/kernel";
import {OmoSafeState} from "../manifest";
import BN from "omo-quirks/dist/BN";

export type TransitivePath = {
  flow: string,
  transfers: [{
    from:string,
    to:string,
    token:string,
    tokenOwner:string,
    value: string
  }]
}

export const findTransitivePath = async (context: TransferCirclesContext) : Promise<TransitivePath> =>
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  try {
    const circlesValueInWei = context.web3.utils
      .toWei(context.data.value.value.toString(), "ether")
      .toString();
    const oValueInWei = new BN(circlesValueInWei).div(new BN("3"));

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "from":safeState.mySafeAddress,
      "to":context.data.recipient.value,
      "value":oValueInWei.toString()
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };

    const response = await fetch("http://18.194.182.180/flow", requestOptions)
    const result = await response.json();

    window.o.logger.log("Transitive path is: ", result);

    return <TransitivePath>result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
