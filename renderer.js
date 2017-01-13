// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const dialog = electron.remote.dialog;
const fs = require('fs');
const path = require('path');

const Session = require('./session');
const databaseFactory = require('./db/database-factory').databaseFactory;

import React from 'react';
import ReactDOM from 'react-dom';

import App from './component/app.jsx';
import Timer from './timer';

let editor;
let keyWords = getKeyWords();

let session = new Session();

session.load(function(doc) {
	loadEditor(doc);
});

ipcRenderer.on('quantum:open', (event, message) => openFile());
ipcRenderer.on('quantum:save', (event, message) => saveFile());
ipcRenderer.on('quantum:execute', (event, message) => executeSQL());
ipcRenderer.on('quantum:format', (event, message) => editor.formatSQL());
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

	fs.readFile(files[0], 'utf-8', function (error, data) {
		if (error) {
			editor.setMessage(error.message);
		}
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

		fs.writeFile(file, editor.getValue(), function (error) {
			if (error) {
				editor.setMessage(error.message);
			}
	  });
}

function loadEditor(doc) {

	let snippets = fs.readFileSync('./snippets.txt', 'utf8');

	let onSuccess = function(res) {

		let tables = res.rows.map((row) => row[0]);

			editor = ReactDOM.render(
					<App
						id={doc._id}
						value={doc.value}
						snippets={snippets}
						keywords={keyWords}
						tables={tables}
						cursorPosition={doc.cursorPosition}
						result={doc.result}
						split={doc.split}
						message={doc.message}
						/>, document.getElementById('app'));

	};

	let onError = function(error) {
		editor.setMessage(error.message);
	};

	databaseFactory.create().getTableNames(onSuccess, onError);
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

	let state = editor.getState();

	session.save(state, function() {
		event.sender.send('close-ok');
	});
}

function executeSQL() {

	let timer = new Timer();

	timer.start();

	let onSuccess = function(result) {
		timer.stop();
		editor.setMessage(result.rows.length + " rows in " + timer.getTime() + " ms");
		editor.setResult(result);
	};

	let onError = function(error) {
		editor.setMessage(error.message);
	};

	databaseFactory.create().execute(editor.getSQL(), onSuccess, onError);
}
