import Web3 from "web3";
import Common from "ethereumjs-common";
import {BN} from "ethereumjs-util";

export const config = {
  ganache: {
    GNOSIS_SAFE_ADDRESS: '0x2f866f565FB2E1B6C7686933127A7Fde69F12d66',
    PROXY_FACTORY_ADDRESS: '0xcE2b62c9894cD0d978d256311dE6010D084BB959',
    HUB_ADDRESS: "0x39a38B95e3FC183FB37cDC251548649Fcf21c626",
    HUB_BLOCK: new BN(""),
    ACCOUNT: {
      address: "0x528ae4B4C9E77d2F518824cfEEd361F5faD978f4",
      privateKey: "0xf78ddb6bd35255b1e8621976d82bf4597daa1299e1a24c7f5975f11aefb2e43c",
      safeAddress: ""
    },
    getGasPrice: (web3: Web3) => new BN(web3.utils.toWei("1", "gwei")),
    ethjs: {
      getCommon: async function (web3: Web3)
      {
        return undefined;
      }
    },
    web3: () =>
    {
      const provider = new Web3.providers.HttpProvider(
        "HTTP://127.0.0.1:7545"
      );

      const web3 = new Web3();
      web3.setProvider(provider);
      return web3;
    }
  },
  xDai: {
    GNOSIS_SAFE_ADDRESS: '0x2CB0ebc503dE87CFD8f0eCEED8197bF7850184ae',
    PROXY_FACTORY_ADDRESS: '0x8b4404DE0CaECE4b966a9959f134f0eFDa636156',
    HUB_ADDRESS: "0x29b9a7fBb8995b2423a71cC17cf9810798F6C543",
    HUB_BLOCK: new BN("12529458"),
    ACCOUNT: {
      address: "",
      privateKey: "",
      safeAddress: ""
    },
    getGasPrice: (web3: Web3) => new BN(web3.utils.toWei("2", "gwei")),
    ethjs: {
      getCommon: async function (web3: Web3)
      {
        return Common.forCustomChain(
          'mainnet',
          {
            name: "xDai",
            networkId: await web3.eth.net.getId(),
            chainId: await web3.eth.getChainId(),
          },
          'istanbul',
        );
      }
    },
    web3: () =>
    {
      const provider = new Web3.providers.WebsocketProvider(
        "wss://xdai.poanetwork.dev/wss",
        {
          timeout: 30000,
          reconnect: {
            auto: true,
            delay: 5000,
            maxAttempts: 5,
            onTimeout: false
          },
          clientConfig: {
            keepalive: true,
            keepaliveInterval: 60000
          }
        }
      );

      const web3 = new Web3();
      web3.setProvider(provider);
      return web3;
    }
  },
  getCurrent: function ()
  {
    return this.xDai;
  }
};
