'use strict';

import electron from 'electron';
const app = electron.remote.app;
const path = require('path');

function AppPath() {

	function getPath(file) {
		const dir = electron.remote.app.getPath('home');
		return path.join(dir, file);
	}

	return {
		getPath : getPath
	}
}

module.exports = new AppPath();
