'use strict';

const dateFormat = require('dateformat');

function Result() {

	function handleErrorIfExists(err) {
		if (err) {
			document.getElementById("info").innerHTML = err.message;
			throw err;
		}
	}

	function refresh(result, time) {
		var html = '';
		html += '<table class="table table-bordered table-striped table-hover">';
		html += '<thead>';
		html += '<th></th>';
		for (var i = 0; i < result.fields.length; i++) {
			var field = result.fields[i]
			html += '<th>' + field.name + '</th>';
		}
		html += '</thead>';
		html += '<tbody>';
		for (var rowIndex = 0; rowIndex < result.rows.length; rowIndex++) {
			var row = result.rows[rowIndex];
			html += '<tr>';
			html += '<td>' + (rowIndex + 1) + '</dh>';
			for (var columnIndex = 0; columnIndex < result.fields.length; columnIndex++) {
				var value = row[columnIndex];
				html += '<td>' + valueToHTML(value) + '</td>';
			}
			html += '</tr>';
		}
		html += '</tbody>';
		html += '</table>';
		document.getElementById("info").innerHTML = result.rows.length + " rows in " + time + " ms";
		document.getElementById("result").innerHTML = html;
	}

	function valueToHTML(value) {
		if (value == null) {
			return '<span class="label label-default">NULL</span>';
		} else if (value instanceof Date) {
			return dateFormat(value, 'yyyy-mm-dd HH:MM:ss.l');
		}
		return escape(value);
	}

	function escape(text) {
		return ('' + text).replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}

	return {
		refresh : refresh,
		handleErrorIfExists : handleErrorIfExists
	}
}

module.exports = Result;
