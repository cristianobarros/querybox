
import fs from 'fs';

import AppPath from './../util/app-path';
import PostgreSQLDatabase from './postgresql/postgresql-database';

class DatabaseFactory {

	create() {
		const config = this.loadConfig();
		switch(config.type) {
			case 'PostgreSQL':
				return new PostgreSQLDatabase(config);
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
