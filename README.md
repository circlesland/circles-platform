![dappscreens](https://user-images.githubusercontent.com/747161/99851260-29611000-2b7f-11eb-9223-e84578960e41.png)

# Omo Li
Building with Omo.Li a lightweight and hostless decentralized wallet and marketplace on top of the CirclesUBI protocol, ipfs and the fission Webnative SDK and identity key management

- DAPP (early alpha WIP): https://omo.li/

## Overview

- Chat: https://discord.gg/gxCpSX2q
- Wishes & Bugs: https://github.com/omoearth/omo/issues
- Roadmap: https://github.com/omoearth/omo/projects/1
- Twitter: https://twitter.com/OmoEarth
- Circles Whitepaper: https://github.com/CirclesUBI/whitepaper/blob/master/README.md
## Dapp


## Tech Stack, architecture and status
- Circles Protocol (UBI-Currency) as non-custodial self-owned personal currency (alpha ready)
- xDAI Blockchain for fast and low-fee transactions (alpha ready)
- Transitive circles payments via a clientside pathfinder (planned)
- Fission: Identity and Key-Management mit keystore-idb, DID and UCAN (planned)
- Fission: Hostless and user-owned IPFS Storage with service workers syncing P2P between the browser clients (planned)
- Caching trust graph and limits in ipfs and sync via fission (planned)
- Svelte as reactive frontend compiler
- Tailwind for the UI-Designsystem

## Install

Clone Repo 
`git clone https://github.com/omoearth/omo-li.git`

Enter directory 
```bash
cd omo-li
```

Install with npm
```bash
npm i
```

Start
```bash
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
---

- [Omo Li](#omo-li)
	- [Overview](#overview)
	- [Dapp](#dapp)
	- [Tech Stack, architecture and status](#tech-stack-architecture-and-status)
	- [Install](#install)
		- [Building for production](#building-for-production)
		- [Hostless deployment to ipfs via fission](#hostless-deployment-to-ipfs-via-fission)
	- [## Frontend Frameworks: Svelte typescript, webpack, tailwind](#-frontend-frameworks-svelte-typescript-webpack-tailwind)
	- [Usage](#usage)
		- [Global styles](#global-styles)
		- [Single page applications](#single-page-applications)
		- [Targeting browsers](#targeting-browsers)
		- [Disabling Babel](#disabling-babel)
		- [Enabling source maps in production](#enabling-source-maps-in-production)
		- [Path mapping](#path-mapping)

---

## Usage

### Global styles
The `/src/styles/index.scss` file will be compiled and embedded at the top of the bundled CSS, effectively making it a global stylesheet. You can easily add additional stylesheets to the bundle by editing the `stylesheets` variable at the top of `webpack.config.js`:

```js
const stylesheets = [
    './src/styles/index.scss'
];
```

### Single page applications
If you're building a single page application (which needs multiple routes), edit your package.json file:

- Add the `--history-api-fallback` flag to the `"dev"` command
- Add the `--single` flag to the `"start"` command.

```json
"scripts": {
    "dev": "webpack-dev-server [...] --history-api-fallback",
    "start": "serve [...] --single",
}
```

### Targeting browsers
[Babel](https://babeljs.io/docs/en/) and [Autoprefixer](https://www.npmjs.com/package/autoprefixer) will be used to make bundles work in your target browsers, which are listed under `browserslist` in your package.json file. Check out the list of [browserslist queries](https://github.com/browserslist/browserslist#full-list) to customize this.

```json
{
    "browserslist": [
        "defaults"
    ]
}
```

Note that Babel is only active for production builds by default, so it won't slow down your development.

### Disabling Babel
If you don't need to support older browsers, you can reduce your bundle size by disabling Babel. Just change the `useBabel` variable at the top of `webpack.config.js`:

```js
const useBabel = false;
```

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
