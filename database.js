'use strict';

const pg = require('pg');
const Result = require('./result');
const fs = require('fs');
const path = require('path');
const Timer = require('./timer');

function Database() {

	const config = loadConfig();

	let result = new Result();

	function getTableNames(callback) {
		let sql = "SELECT * FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema');";

		var client = new pg.Client(config);

		client.connect(function(err) {

			result.handleErrorIfExists(err);

			client.query(sql, function(err, res) {

				result.handleErrorIfExists(err);

				callback(res.rows.map(function(row) {
					return row.table_name;
				}));

				client.end(function (err) {
					result.handleErrorIfExists(err);
				});
			});

		});
	}

	function execute(sql, doc) {

			var client = new pg.Client(config);

			client.connect(function(err) {

				result.handleErrorIfExists(err);

				let timer = new Timer();

				timer.start();

				client.query(sql, function(err, res) {

					timer.stop();
					doc.result = res;
					doc.time = timer.getTime();

					result.handleErrorIfExists(err);
					result.refresh(res, timer.getTime());

					client.end(function (err) {
						result.handleErrorIfExists(err);
					});
				});

			});
	}

	function loadConfig() {
		return JSON.parse(fs.readFileSync(path.join(__dirname, 'connection.properties'), 'utf8'));
	}

	return {
		getTableNames : getTableNames,
		execute : execute
	}
}

module.exports = Database;
