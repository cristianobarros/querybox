'use strict';

import fs from 'fs';

import AppPath from './../app-path';
import PostgreSQLDatabase from './postgresql/postgresql-database';

function DatabaseFactory() {

	function create() {
		const config = loadConfig();
		switch(config.type) {
			case 'PostgreSQL':
				return new PostgreSQLDatabase(config);
			default:
				throw 'Unknown database type: ' + config.type;
		}
	}

	function hasConfig() {
		return fs.existsSync(getFilePath());
	}

	function loadConfig() {
		return JSON.parse(fs.readFileSync(AppPath.getPath('connection.json'), 'utf8'));
	}

	function saveConfig(data) {
		fs.writeFileSync(AppPath.getPath('connection.json'), JSON.stringify(data));
	}

	function getFilePath() {
		return AppPath.getPath('connection.json');
	}

	return {
		create : create,
		hasConfig : hasConfig,
		loadConfig : loadConfig,
		saveConfig : saveConfig
	}
}

module.exports = new DatabaseFactory();
