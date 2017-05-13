
import fs from 'fs';

import AppPath from './../util/app-path';
import MySQLDatabase from './mysql/mysql-database';
import PostgreSQLDatabase from './postgresql/postgresql-database';
import SQLServerDatabase from './sqlserver/sqlserver-database';

class DatabaseFactory {

	create() {
		const config = this.loadConfig();
		switch(config.type) {
			case 'MySQL':
				return new MySQLDatabase(config);
			case 'PostgreSQL':
				return new PostgreSQLDatabase(config);
				case 'SQLServer':
					return new SQLServerDatabase(config);
			default:
				throw 'Unknown database type: ' + config.type;
		}
	}

	hasConfig() {
		return fs.existsSync(this.getFilePath());
	}

	loadConfig() {
		return JSON.parse(fs.readFileSync(this.getFilePath(), 'utf8'));
	}

	saveConfig(data) {
		fs.writeFileSync(this.getFilePath(), JSON.stringify(data));
	}

	getFilePath() {
		return AppPath.getPath('connection.json');
	}

}

export default new DatabaseFactory();
