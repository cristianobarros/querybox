// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

const Session = require('./session');
const DatabaseFactory = require('./db/database-factory');

import React from 'react';
import ReactDOM from 'react-dom';

import App from './containers/app.jsx';
import KeywordManager from './db/keyword-manager';
import SnippetManager from './db/snippet-manager';

let app;

let session = new Session();

session.load(function(doc) {
	loadEditor(doc);
});

ipcRenderer.on('quantum:open', (event, message) => app.openFile());
ipcRenderer.on('quantum:save', (event, message) => app.saveFile());
ipcRenderer.on('quantum:execute', (event, message) => app.executeSQL());
ipcRenderer.on('quantum:format', (event, message) => app.formatSQL());
ipcRenderer.on('close', (event, message) => saveEditor(event));

function loadEditor(doc) {

	const onSuccess = function(res) {

		const tables = res.rows.map((row) => row[0]);
		const snippets = SnippetManager.getSnippets();
		const keywords = KeywordManager.getKeywords();

		app = ReactDOM.render(
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
		app.setMessage(error.message);
	};

	DatabaseFactory.create().getTableNames(onSuccess, onError);
}

function saveEditor(event) {

	const state = app.getState();

	session.save(state, function() {
		event.sender.send('close-ok');
	});
}
