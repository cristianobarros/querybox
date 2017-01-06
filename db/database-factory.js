'use strict';

const PostgreSQLDatabase = require('./postgresql/postgresql-database');
const SQLServerDatabase = require('./sqlserver/sqlserver-database');

const fs = require('fs');
const path = require('path');

function DatabaseFactory() {

	let props = {
		config : loadConfig()
	};

	function create() {
		switch(props.config.type) {
			case 'PostgreSQL':
				return new PostgreSQLDatabase(props);
			case 'SQLServer' :
				return new SQLServerDatabase(props);
			default:
				throw 'Unknown database type: ' + props.config.type;
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
