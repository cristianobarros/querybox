
const mysql = require('electron').remote.require('mysql');

import MySQLDataType from './mysql-data-type';

export default class MySQLDatabase {

	constructor(config) {
		this.config = config;
	}

	getTableNames(onSuccess, onError) {
		let sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = database() AND table_type NOT LIKE '%VIEW%'";
		this.execute(sql, onSuccess, onError);
	}

	execute(sql, onSuccess, onError) {

		var connection = mysql.createConnection(this.config);

		connection.query(sql, (error, results, fields) => {

		  this.handleErrorIfExists(onError, error);

			onSuccess({
				fields : fields.map(field => {
					return {
						name : field.name,
						type : MySQLDataType[field.type]
					};
				}),
				rows : results.map(result => Object.values(result))
			});

			connection.end((err) => {
				this.handleErrorIfExists(onError, err);
			});

		});

	}

	handleErrorIfExists(onError, error) {
		if (error) {
			onError(error);
			throw error;
		}
	}

}
