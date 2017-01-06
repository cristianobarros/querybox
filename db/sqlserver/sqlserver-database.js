'use strict';

var mssql = require('electron').remote.require('mssql');
const Result = require('../../result');
const Timer = require('../../timer');

function SQLServerDatabase(props) {

	const config = props.config;

	let result = new Result();

	function getTableNames(callback) {

		let sql = "SELECT * FROM information_schema.tables WHERE table_type = 'BASE TABLE';";

		mssql.connect(config, function(err) {

			result.handleErrorIfExists(err);

			new mssql.Request().query(sql, function(err, res) {

				result.handleErrorIfExists(err);

				callback(res.map(function(row) {
					return row.TABLE_NAME;
				}));
			});

		});

	}

	function execute(sql, doc) {

		mssql.connect(config, function(err) {

			result.handleErrorIfExists(err);

			let timer = new Timer();

			timer.start();

			new mssql.Request().query(sql, function(err, res) {

				result.handleErrorIfExists(err);

				timer.stop();
				doc.result = toPostgreSQLFormat(res);
				doc.time = timer.getTime();

				result.refresh(doc.result, doc.time);

			});

		});
		
		function toPostgreSQLFormat(res) {

			let fields = [];
			let rows = [];

			for (let type in res.columns) {
				fields.push(res.columns[type]);
			}

			for (let i = 0; i < res.length; i++) {
				rows.push(res[i]);
			}

			return {
				fields : fields,
				rows : rows
			};
		}

	}

	return {
		getTableNames : getTableNames,
		execute : execute
	}
}

module.exports = SQLServerDatabase;
