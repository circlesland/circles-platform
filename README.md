# Svelte Template with TypeScript and Tailwind

This is a project template for [Svelte](https://svelte.dev) apps written in TypeScript. It lives under [https://github.com/martinbeentjes/svelte-typescript-tailwind](https://github.com/martinbeentjes/svelte-typescript-tailwind). A big thanks goes to [@glorykatende](https://levelup.gitconnected.com/how-to-use-svelte-js-with-tailwind-css-f0554187eca1) on writing a blogpost about adding tailwind to a Svelte project.

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit martinbeentjes/svelte-typescript-tailwind svelte-app
cd svelte-app
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*


## Get started

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.


## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).


## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```

