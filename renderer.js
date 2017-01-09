// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const dialog = electron.remote.dialog;
const fs = require('fs');
const path = require('path');

const Session = require('./session');
const Result = require('./result');
const databaseFactory = require('./db/database-factory').databaseFactory;

import React from 'react';
import ReactDOM from 'react-dom';

import QueryEditor from './component/query-editor.jsx';
import QueryStatusBar from './component/query-status-bar.jsx';

let queryEditor;
let editor;
let doc;
let split;
let keyWords = getKeyWords();

let session = new Session();

session.load(function(d) {
	doc = d;
	loadEditor(doc);
	if (doc.result) {
		new Result().refresh(doc.result, doc.time);
	}
	document.getElementById("info").innerHTML = doc.info;
});

ipcRenderer.on('quantum:open', (event, message) => openFile());
ipcRenderer.on('quantum:save', (event, message) => saveFile());
ipcRenderer.on('quantum:execute', (event, message) => executeSQL());
ipcRenderer.on('quantum:format', (event, message) => queryEditor.formatSQL());
ipcRenderer.on('close', (event, message) => saveEditor(event));

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

	let Split = require("./node_modules/split.js/split");

	split = Split(['#editor', '#result'], {
		sizes : doc.split,
		direction : 'vertical',
		onDrag: () => editor.resize()
	});

	let snippets = fs.readFileSync('./snippets.txt', 'utf8');

	databaseFactory.create().getTableNames(function(tables) {

		queryEditor = ReactDOM.render(
			<QueryEditor
				value={doc.sql}
				snippets={snippets}
				keywords={keyWords}
				tables={tables}
				cursorPosition={doc.cursorPosition}
				/>, document.getElementById('editor'));

		editor = queryEditor.refs.queryBoxTextarea.editor;

		ReactDOM.render(<QueryStatusBar editor={editor} />, document.getElementById('status'));

	});

}

function getKeyWords() {
	let file = fs.readFileSync('./keywords.txt', 'utf8');
	let keywords = file.split('\n');
	for (let i = 0; i < keywords.length; i++) {
		keywords[i] = keywords[i].trim();
	}
	return keywords;
}

function saveEditor(event) {

	var sql = editor.getValue();
	var cursorPosition = editor.getCursorPosition();

	doc.sql = sql;
	doc.cursorPosition = cursorPosition;
	doc.info = document.getElementById("info").innerHTML;
	doc.split = split.getSizes();

	session.save(doc, function() {
		event.sender.send('close-ok');
	});
}

function executeSQL() {
	databaseFactory.create().execute(queryEditor.getSQL(), doc);
}
