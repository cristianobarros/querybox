'use strict';

import electron from 'electron';
const app = electron.remote.app;
const path = require('path');

function AppPath() {

	function getPath(file) {
		const home = electron.remote.app.getPath('home');
		const app = path.join(home, '.quantum');
		return path.join(app, file);
	}

	return {
		getPath : getPath
	}
}

module.exports = new AppPath();
