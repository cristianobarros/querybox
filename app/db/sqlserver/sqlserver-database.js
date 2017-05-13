
const mssql = require('electron').remote.require('mssql');

export default class SQLServerDatabase {

	constructor(config) {
		this.config = config;
	}

	getTableNames(onSuccess, onError) {
		let sql = "SELECT table_name as name FROM information_schema.tables";
		this.execute(sql, onSuccess, onError);
	}

	execute(sql, onSuccess, onError) {

		const pool = new mssql.ConnectionPool({
			server: this.config.host,
			port: this.config.port,
			database: this.config.database,
			user: this.config.user,
			password: this.config.password,
		});

		pool.connect(error => {

			this.handleErrorIfExists(onError, error);

			pool.request().query(sql, (error, result) => {

				this.handleErrorIfExists(onError, error);

				const fields = Object.keys(result.recordset[0] || {});

				onSuccess({
					fields : fields.map(name => {
						return {
							name : name,
							type : undefined
						};
					}),
					rows : result.recordset.map(result => this.mapToArray(result, fields))
				});

				pool.close();
	    });

		});

	}

	mapToArray(result, fields) {
		const array = [];
		fields.forEach(key => {
				array.push(result[key]);
		});
		return array;
	}

	handleErrorIfExists(onError, error) {
		if (error) {
			onError(error);
			throw error;
		}
	}

}
