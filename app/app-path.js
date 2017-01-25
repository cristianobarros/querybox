'use strict';

import fs from 'fs';
import electron from 'electron';
const app = electron.remote.app;
import path from 'path';

function AppPath() {

	function getPath(file) {
		const app = getAppPath();
		return path.join(app, file);
	}

	function getAppPath() {
		const home = electron.remote.app.getPath('home');
		return path.join(home, '.quantum');
	}

	function createAppPathIfDoNotExists() {
		const appPath = getAppPath();
		if (!fs.existsSync(appPath)) {
			fs.mkdir(appPath);
		}
	}

	return {
		getPath : getPath,
		createAppPathIfDoNotExists : createAppPathIfDoNotExists
	}
}

module.exports = new AppPath();
