'use strict';

const PostgreSQLDatabase = require('./postgresql/postgresql-database');

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
		return JSON.parse(fs.readFileSync('./connection.json', 'utf8'));
	}

	return {
		create : create
	}
}

module.exports = {
	databaseFactory : new DatabaseFactory()
};
