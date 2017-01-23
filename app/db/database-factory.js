'use strict';

const fs = require('fs');

import AppPath from './../app-path';
import PostgreSQLDatabase from './postgresql/postgresql-database';

function DatabaseFactory() {

	let config = loadConfig();

	function create() {
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
		config = data;
	}

	return {
		create : create,
		loadConfig : loadConfig,
		saveConfig : saveConfig
	}
}

module.exports = new DatabaseFactory();
