# QueryBox

### A simple and lightweight SQL client with cross database and platform support.

## Install

First, clone the repo via git:

```bash
git clone git@bitbucket.org:cristiano_barros/querybox.git
```

And then install dependencies:
```bash
$ cd querybox/app && npm install && cd .. && npm install
```

## Run

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a server sends hot updates to the renderer process:

```bash
$ npm run dev
```

## Packaging

To package apps for the supported platforms:

```bash
$ npm run dist:linux
$ npm run dist:macos
$ npm run dist:windows
```