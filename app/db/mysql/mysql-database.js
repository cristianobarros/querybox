
const mysql = require('electron').remote.require('mysql');

export default class MySQLDatabase {

	constructor(config) {
		this.config = config;
	}

	getTableNames(onSuccess, onError) {
		let sql = "SELECT table_name as name FROM information_schema.tables WHERE table_schema = database() AND table_type NOT LIKE '%VIEW%' ORDER BY table_name";
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
						type : undefined
					};
				}),
				rows : results.map(result => this.mapToArray(result, fields))
			});

			connection.end((err) => {
				this.handleErrorIfExists(onError, err);
			});

		});

	}

	mapToArray(result, fields) {
		let index = 0;
		const array = [];
		fields.forEach(field => {
			array[index++] = result[field.name];
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
