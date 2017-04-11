'use strict';

const pg = require('electron').remote.require('pg');

import PostgreSQLDataType from './postgresql-data-type';

function PostgreSQLDatabase(config) {

	function getTableNames(onSuccess, onError) {
		let sql = "SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema');";
		execute(sql, onSuccess, onError);
	}

	function execute(sql, onSuccess, onError) {

			var client = new pg.Client(config);

			client.connect(function(err) {

				handleErrorIfExists(onError, err);

				client.query({ rowMode : "array", text : sql }, function(err, res) {

					handleErrorIfExists(onError, err);

					onSuccess({
						fields : res.fields.map(function(field) {
							return {
								name : field.name,
								type : PostgreSQLDataType[field.dataTypeID]
							};
						}),
						rows : res.rows
					});

					client.end(function (err) {
						handleErrorIfExists(onError, err);
					});
				});

			});
	}

	function handleErrorIfExists(onError, error) {
		if (error) {
			onError(error);
			throw error;
		}
	}

	return {
		getTableNames : getTableNames,
		execute : execute
	}
}

module.exports = PostgreSQLDatabase;
