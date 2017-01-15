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

import App from './containers/app.jsx';
import Timer from './timer';
import KeywordManager from './db/keyword-manager';
import SnippetManager from './db/snippet-manager';

let editor;

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

	const files = dialog.showOpenDialog({
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

		const file = dialog.showSaveDialog({
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

	const onSuccess = function(res) {

		const tables = res.rows.map((row) => row[0]);
		const snippets = SnippetManager.getSnippets();
		const keywords = KeywordManager.getKeywords();

		editor = ReactDOM.render(
			<App
				id={doc._id}
				value={doc.value}
				snippets={snippets}
				keywords={keywords}
				tables={tables}
				cursorPosition={doc.cursorPosition}
				result={doc.result}
				split={doc.split}
				message={doc.message}
				/>,
			document.getElementById('app')
		);

	};

	const onError = function(error) {
		editor.setMessage(error.message);
	};

	databaseFactory.create().getTableNames(onSuccess, onError);
}

function saveEditor(event) {

	const state = editor.getState();

	session.save(state, function() {
		event.sender.send('close-ok');
	});
}

function executeSQL() {

	const timer = new Timer();

	timer.start();

	const onSuccess = function(result) {
		timer.stop();
		editor.setMessage(result.rows.length + " rows in " + timer.getTime() + " ms");
		editor.setResult(result);
	};

	const onError = function(error) {
		editor.setMessage(error.message);
	};

	databaseFactory.create().execute(editor.getSQL(), onSuccess, onError);
}
