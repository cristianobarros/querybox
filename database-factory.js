'use strict';

const PostgreSQLDatabase = require('./postgresql-database');
const SQLServerDatabase = require('./sqlserver-database');

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
		return JSON.parse(fs.readFileSync(path.join(__dirname, 'connection.json'), 'utf8'));
	}

	return {
		create : create
	}
}

module.exports = {
	databaseFactory : new DatabaseFactory()
};
