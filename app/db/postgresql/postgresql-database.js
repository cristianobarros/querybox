
const pg = require('electron').remote.require('pg');

import PostgreSQLDataType from './postgresql-data-type';

export default class PostgreSQLDatabase {

	constructor(config) {
		this.config = config;
	}

	getTableNames(onSuccess, onError) {
		let sql = "SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema');";
		this.execute(sql, onSuccess, onError);
	}

	execute(sql, onSuccess, onError) {

			var client = new pg.Client(this.config);

			client.connect(err => {

				this.handleErrorIfExists(onError, err);

				client.query({ rowMode : "array", text : sql }, (err, res) => {

					this.handleErrorIfExists(onError, err);

					onSuccess({
						fields : res.fields.map(field => {
							return {
								name : field.name,
								type : PostgreSQLDataType[field.dataTypeID]
							};
						}),
						rows : res.rows
					});

					client.end(err => {
						this.handleErrorIfExists(onError, err);
					});
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
