
const pg = require('electron').remote.require('pg');

import 'babel-polyfill'

import PostgreSQLDataType from './postgresql-data-type';

export default class PostgreSQLDatabase {

	constructor(config) {
		this.config = config;
	}

	async getTableNames() {
		const sql = "SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema');";
		return await this.execute(sql);
	}

	async execute(sql) {

		const client = new pg.Client(this.config);

		try {

			await client.connect();

			const result = await client.query({ rowMode : "array", text : sql });

			return {
				fields : result.fields.map(field => {
					return {
						name : field.name,
						type : PostgreSQLDataType[field.dataTypeID]
					};
				}),
				rows : result.rows
			};

		} finally {
			await client.end();
		}
	}

}
