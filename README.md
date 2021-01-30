![dappscreens](https://user-images.githubusercontent.com/747161/99851260-29611000-2b7f-11eb-9223-e84578960e41.png)

# Omo Li
Building with Omo.Li a lightweight and hostless decentralized wallet and marketplace on top of the CirclesUBI protocol, ipfs and the fission Webnative SDK and identity key management

- DAPP (early alpha WIP): https://omo.li/

## Overview

- Chat: https://discord.gg/gxCpSX2q
- Discussion Forum: https://github.com/omoearth/omo-li/discussions
- Wishes & Bugs: https://github.com/omoearth/omo/issues
- Roadmap: https://github.com/omoearth/omo/projects/1
- Twitter: https://twitter.com/OmoEarth
- Omo Visionpaper: https://omo.li/#/visionpaper

## Dapp


## Tech Stack, architecture and status
- CirclesUBI Protocol, a non-custodial self-owned personal currency 
- xDAI Blockchain for fast and low-fee transactions
- Transitive circles payments via a clientside pathfinder 
- Fission: Identity and Key-Management mit keystore-idb, DID and UCAN 
- Fission: Hostless and user-owned IPFS Storage with service workers syncing P2P between the browser clients
- Caching trust graph and limits in locala browser js-ipfs and sync via fission service-workers
- Svelte as reactive frontend compiler
- Tailwind for the UI-Designsystem

## Install

Clone Repo 
`git clone https://github.com/omoearth/omo-li.git`


Install with npm
```bash
./build.sh
```

Start
```bash
cd packages/omo-shell
npm run dev
```
Go to your browser and open https://0.0.0.0:5000


### Building for production
The `build` script will compile the app for production. By default, the bundle will be created at `/public/build/`, which means your public directory will contain everything you need to run the app.

```bash
npm run build
```

To run the production build, use the `start` command and open [http://localhost:8080](http://localhost:8080) in your browser.

```bash
npm run start
```

### Hostless deployment to ipfs via fission
For more information about fission, read the docs: 
https://guide.fission.codes/

Install
```bash
brew install fission-suite/fission/fission-cli
```

Setup your account keys with fission
```bash
fission setup --verbose
```

Register your dapp and enter path of build folder (./public)
```bash
fission app register --verbose
```

Publish and delpoy your dapp
```bash
npm run deploy
```
This will first build and then publish your dapp to ipfs via the fission service


## Frontend Frameworks: Svelte typescript, webpack, tailwind

### Enabling source maps in production
By default, this template won't generate source maps for production bundles in order to avoid exposing your source code. If you need to enable source maps in production (such as for debugging), update the `sourceMapsInProduction` variable at the top of `webpack.config.js`.

```js
const sourceMapsInProduction = true;
```

### Path mapping
By default, the `src` alias is mapped to your `src/` directory, which means you can import like this:

```js
import Navbar from 'src/components/Navbar.svelte';
```

If you wish to add additional aliases, you only need to edit the `paths` property in your `tsconfig.json`, and they will be automatically applied to Webpack:

```json
"paths": {
    "src": ["src"]
}
```
