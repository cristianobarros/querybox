// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');
const path = require('path');
const pg = require('pg');
const config = loadConfig();

var ace = require("brace");

require("brace/mode/sql");
require("brace/theme/vibrant_ink");
require("brace/ext/language_tools");
require("brace/ext/statusbar");

let editor;
let doc = {
	sql : "",
	cursorPosition : {row:0, column:0}
};

var Datastore = require('nedb');

var db = new Datastore({ filename: "sessions.db", autoload: true });

db.find({}, function(err, docs) {
	if (docs.length > 0) {
		doc = docs[0];
	}
	loadEditor(doc);
});

require('electron').ipcRenderer.on('close', function(event, message) {
	saveEditor(event);
});

function loadEditor(doc) {

	document.getElementById("editor").innerHTML = doc.sql;

	editor = ace.edit("editor");

	editor.setTheme("ace/theme/vibrant_ink");
	editor.getSession().setMode("ace/mode/sql");
	editor.setFontSize("14px");
	editor.setShowPrintMargin(false);
	editor.setOptions({
		enableBasicAutocompletion: true
	});

	editor.focus();
	editor.moveCursorToPosition(doc.cursorPosition);

	var StatusBar = ace.acequire("ace/ext/statusbar").StatusBar;
	var statusBar = new StatusBar(editor, document.getElementById("status"));

	statusBar.updateStatus(editor);

	editor.commands.addCommand({
		name: "execute",
		bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" },
		exec: function() {
			var sql = getSQL();
			execute(sql);
		}
	});

	editor.commands.addCommand({
		name: "format",
		bindKey: { win: "Ctrl-Shift-F", mac: "Command-Shift-F" },
		exec: function() {
			var position = editor.session.selection.toJSON();
			editor.setValue(editor.getValue().toUpperCase());
			editor.session.selection.fromJSON(position);
		}
	});
}

function saveEditor(event) {

	var sql = editor.getValue();
	var cursorPosition = editor.getCursorPosition();

	var docToSave = {
		"sql" : sql,
		"cursorPosition" : cursorPosition
	};

	if (doc._id == null) {
		db.insert(docToSave, function (err, newDoc) {
			event.sender.send('close-ok');
		});
	} else {
		db.update({ "_id" : doc._id,}, { $set : docToSave }, function (err, numReplaced) {
			event.sender.send('close-ok');
		});
	}
}

function loadConfig() {
	return JSON.parse(fs.readFileSync(path.join(__dirname, 'connection.properties'), 'utf8'));
}

function getSQL() {
	return editor.getSelectedText() || editor.getValue();
}

function execute(sql) {

	var client = new pg.Client(config);

	client.connect(function(err) {

		if (err) {
			document.getElementById("info").innerHTML = err.message;
			throw err;
		}

		var start = new Date();

		const query = client.query(sql, function(err, result) {

			if (err) {
				document.getElementById("info").innerHTML = err.message;
				throw err;
			}

			showResult(result, new Date() - start);
			// disconnect the client
			client.end(function (err) {
				if (err) throw err;
			});
		});

	});
}

function showResult(result, time) {
	var html = '';
	html += '<table class="table table-bordered table-striped table-hover">';
	html += '<thead>';
	for (var i = 0; i < result.fields.length; i++) {
		var field = result.fields[i]
		html += '<th>' + field.name + '</th>';
	}
	html += '</thead>';
	html += '<tbody>';
	for (var i = 0; i < result.rows.length; i++) {
		var row = result.rows[i];
		html += '<tr>';
		for (var j = 0; j < result.fields.length; j++) {
			var field = result.fields[j];
			var value = row[field.name];
			html += '<td>' + escape(value) + '</td>';
		}
		html += '</tr>';
	}
	html += '</tbody>';
	html += '</table>';
	document.getElementById("info").innerHTML = result.rowCount + " rows in " + time + " ms";
	document.getElementById("result").innerHTML = html;
}

function escape(text) {
	return ('' + text).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
