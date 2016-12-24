// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const fs = require('fs');
const path = require('path');
const pg = require('pg');
const config = loadConfig();
const dateFormat = require('dateformat');

const Timer = require('./timer');
const Formatter = require('./formatter');
const Session = require('./session');

var ace = require("brace");

require("brace/mode/sql");
require("brace/theme/vibrant_ink");
require("brace/ext/language_tools");
require("brace/ext/statusbar");

let editor;
let doc;

let session = new Session();

session.load(function(document) {
	doc = document;
	loadEditor(document);
});

ipcRenderer.on('close', function(event, message) {
	saveEditor(event);
});

ipcRenderer.on('matissa:execute', function(event, message) {
	executeSQL();
});

ipcRenderer.on('matissa:format', function(event, message) {
	formatSQL();
});

function loadEditor(doc) {

	document.getElementById("editor").innerHTML = doc.sql;

	editor = ace.edit("editor");

	var snippetManager = ace.acequire("ace/snippets").snippetManager;
	var snippets = snippetManager.parseSnippetFile(fs.readFileSync(path.join(__dirname, 'snippets.txt'), 'utf8'));

	snippetManager.register(snippets);

	editor.setTheme("ace/theme/chrome");
	editor.getSession().setMode("ace/mode/sql");
	editor.setFontSize("14px");
	editor.setShowPrintMargin(false);
	editor.setOptions({
		enableSnippets: true,
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
			executeSQL();
		}
	});

	editor.commands.addCommand({
		name: "format",
		bindKey: { win: "Ctrl-Shift-F", mac: "Command-Shift-F" },
		exec: function() {
			formatSQL();
		}
	});
}

function formatSQL() {
	let formatter = new Formatter();
	var position = editor.session.selection.toJSON();
	editor.setValue(formatter.format(getSQL()));
	editor.session.selection.fromJSON(position);
}

function saveEditor(event) {

	var sql = editor.getValue();
	var cursorPosition = editor.getCursorPosition();

	doc.sql = sql;
	doc.cursorPosition = cursorPosition;

	session.save(doc, function() {
		event.sender.send('close-ok');
	});
}

function loadConfig() {
	return JSON.parse(fs.readFileSync(path.join(__dirname, 'connection.properties'), 'utf8'));
}

function getSQL() {
	return editor.getSelectedText() || editor.getValue();
}

function executeSQL() {

	var client = new pg.Client(config);

	client.connect(function(err) {

		if (err) {
			document.getElementById("info").innerHTML = err.message;
			throw err;
		}

		let timer = new Timer();

		timer.start();

		const query = client.query(getSQL(), function(err, result) {

			if (err) {
				document.getElementById("info").innerHTML = err.message;
				throw err;
			}

			timer.stop();

			showResult(result, timer.getTime());
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
	html += '<th></th>';
	for (var i = 0; i < result.fields.length; i++) {
		var field = result.fields[i]
		html += '<th>' + field.name + '</th>';
	}
	html += '</thead>';
	html += '<tbody>';
	for (var i = 0; i < result.rows.length; i++) {
		var row = result.rows[i];
		html += '<tr>';
		html += '<td>' + (i + 1) + '</dh>';
		for (var j = 0; j < result.fields.length; j++) {
			var field = result.fields[j];
			var value = row[field.name];
			html += '<td>' + valueToHTML(value) + '</td>';
		}
		html += '</tr>';
	}
	html += '</tbody>';
	html += '</table>';
	document.getElementById("info").innerHTML = result.rowCount + " rows in " + time + " ms";
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
