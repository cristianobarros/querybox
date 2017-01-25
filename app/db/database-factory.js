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

	function loadConfig() {
		return JSON.parse(fs.readFileSync(AppPath.getPath('connection.json'), 'utf8'));
	}

	function saveConfig(data) {
		fs.writeFileSync(AppPath.getPath('connection.json'), JSON.stringify(data));
	}

	return {
		create : create,
		loadConfig : loadConfig,
		saveConfig : saveConfig
	}
}

module.exports = new DatabaseFactory();
