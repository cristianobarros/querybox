'use strict';

import fs from 'fs';

import AppPath from './app-path';

function Configuration() {

	function load() {
		return JSON.parse(fs.readFileSync(getFilePath(), 'utf8'));
	}

	function save(data) {
		fs.writeFileSync(getFilePath(), JSON.stringify(data));
	}

	function getDefault() {
		return {
			theme : "chrome"
		}
	}

	function createDefaultIfDoNotExists() {
		const path = getFilePath();
		if (!fs.existsSync(path)) {
			save(getDefault());
		}
	}

	function getFilePath() {
		return AppPath.getPath('configuration.json');
	}

	return {
		load : load,
		save : save,
		createDefaultIfDoNotExists : createDefaultIfDoNotExists
	}
}

module.exports = new Configuration();
