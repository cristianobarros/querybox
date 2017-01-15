'use strict';

const PostgreSQLDatabase = require('./postgresql/postgresql-database');

import electron from 'electron';
const app = electron.remote.app;
const fs = require('fs');
const path = require('path');

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
		const dir = electron.remote.app.getPath('home');
		const file = path.join(dir, '.connection.json');
		return JSON.parse(fs.readFileSync(file, 'utf8'));
	}

	return {
		create : create
	}
}

module.exports = {
	databaseFactory : new DatabaseFactory()
};
