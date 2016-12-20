// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const pg = require('pg');

var ace = require("brace");

require("brace/mode/sql");
require("brace/theme/vibrant_ink");
require("brace/ext/language_tools");
require("brace/ext/statusbar");

var editor = ace.edit("editor");

editor.setTheme("ace/theme/vibrant_ink");
editor.getSession().setMode("ace/mode/sql");
editor.setFontSize("14px");
editor.setShowPrintMargin(false);
editor.setOptions({
	enableBasicAutocompletion: true
});

editor.focus();

var StatusBar = ace.acequire("ace/ext/statusbar").StatusBar;
var statusBar = new StatusBar(editor, document.getElementById("status"));

editor.commands.addCommand({
	name: "execute",
	bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" },
	exec: function() {
		var sql = getSQL();
		alert(sql);
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

function getSQL() {
	return editor.getSelectedText() || editor.getValue();
}

function execute(sql) {

	var config = {
	  user: 'postgres',
	  database: 'analisa',
	  password: 'admin',
	  host: 'localhost',
	  port: 5432
	};

	var client = new pg.Client(config);

	client.connect();

	const query = client.query(sql, function(err, result){
		if (err) {
			alert("Error: " + err.message);
			throw err;
		}
		alert(JSON.stringify(result.rows));
		// disconnect the client
		client.end(function (err) {
			if (err) throw err;
		});
	});
}
