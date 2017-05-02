[![Build Status](https://travis-ci.org/cristianobarros/querybox.svg?branch=master)](https://travis-ci.org/cristianobarros/querybox)
[![Build status](https://ci.appveyor.com/api/projects/status/tq537m2v3d2f76j8/branch/master?svg=true)](https://ci.appveyor.com/project/cristianobarros/querybox/branch/master)
[![Dependency Status](https://david-dm.org/cristianobarros/querybox.svg)](https://david-dm.org/cristianobarros/querybox)

# QueryBox

### A simple and lightweight SQL client with cross database and platform support.

## Install

First, clone the repo via git:

```bash
git clone https://github.com/cristianobarros/querybox.git
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
