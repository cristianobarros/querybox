// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const dialog = electron.remote.dialog;
const fs = require('fs');
const path = require('path');

const Formatter = require('./formatter');
const Session = require('./session');
const Result = require('./result');
const databaseFactory = require('./database-factory').databaseFactory;

var ace = require("brace");

require("brace/mode/sql");
require("brace/theme/chrome");
require("brace/ext/language_tools");
require("brace/ext/statusbar");

let editor;
let doc;
let keyWords = getKeyWords();
let tableNames = [];

let session = new Session();

session.load(function(d) {
	doc = d;
	loadEditor(doc);
	if (doc.result) {
		new Result().refresh(doc.result, doc.time);
	}
	document.getElementById("info").innerHTML = doc.info;
});

ipcRenderer.on('matissa:open', function(event, message) {
	openFile();
});

ipcRenderer.on('matissa:save', function(event, message) {
	saveFile();
});

ipcRenderer.on('matissa:execute', function(event, message) {
	executeSQL();
});

ipcRenderer.on('matissa:format', function(event, message) {
	formatSQL();
});

ipcRenderer.on('close', function(event, message) {
	saveEditor(event);
});

function openFile() {

	let files = dialog.showOpenDialog({
	  filters: [
	    {name: 'SQL', extensions: ['sql']},
	    {name: 'All Files', extensions: ['*']}
	  ],
		properties: ['openFile']
	});

	if (files === undefined) {
		return;
	}

	fs.readFile(files[0], 'utf-8', function (err, data) {
		editor.setValue(data);
  });
}

function saveFile() {

		let file = dialog.showSaveDialog({
		  filters: [
		    {name: 'SQL', extensions: ['sql']},
		    {name: 'All Files', extensions: ['*']}
		  ]
		});

		if (file === undefined) {
			return;
		}

		fs.writeFile(file, editor.getValue(), function (err) {
			new Result().handleErrorIfExists(err);
	  });
}

function loadEditor(doc) {

	document.getElementById("editor").innerHTML = doc.sql;

	editor = ace.edit("editor");

	let Split = require("./node_modules/split.js/split");

	var instance = Split(['#editor', '#result'], {
		sizes : doc.split,
		direction : 'vertical',
		onDrag: function() {
			editor.resize();
		}
	});

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

	databaseFactory.create().getTableNames(function(names) {
		tableNames = names;
		buildCompleter();
	});

	buildCompleter();
}

function buildCompleter() {

		let words = keyWords.map(function(word) {
			return {
				caption: word,
				value: word,
				meta: "keyword"
			};
		});

		let tables = tableNames.map(function(word) {
			return {
				caption: word,
				value: word,
				meta: "table"
			};
		});

		let staticWordCompleter = {
		  getCompletions: function(editor, session, pos, prefix, callback) {
		    callback(null, words.concat(tables));
		  }
		};

		editor.completers = [staticWordCompleter];
}

function getKeyWords() {
	let file = fs.readFileSync(path.join(__dirname, 'keywords.txt'), 'utf8');
	let keywords = file.split('\n');
	for (let i = 0; i < keywords.length; i++) {
		keywords[i] = keywords[i].trim();
	}
	return keywords;
}

function formatSQL() {
	let formatter = new Formatter();
	var position = editor.session.selection.toJSON();
	editor.setValue(formatter.format(getSQL(), keyWords));
	editor.session.selection.fromJSON(position);
}

function saveEditor(event) {

	var sql = editor.getValue();
	var cursorPosition = editor.getCursorPosition();

	doc.sql = sql;
	doc.cursorPosition = cursorPosition;
	doc.info = document.getElementById("info").innerHTML;
	doc.split = getSplitSizes();

	session.save(doc, function() {
		event.sender.send('close-ok');
	});
}

function getSplitSizes() {

	var editorHeight = extractHeight(document.getElementById("editor").style.height);
	var resultHeight = extractHeight(document.getElementById("result").style.height);

	return [editorHeight, resultHeight];
}

function extractHeight(height) {

	let percentualPattern = /(\d*?\.?\d*)%/;

	if (percentualPattern.test(height)) {
		return parseFloat(percentualPattern.exec(height)[1]);
	}

	return height;
}

function getSQL() {
	return editor.getSelectedText() || editor.getValue();
}

function executeSQL() {
	databaseFactory.create().execute(getSQL(), doc);
}
