
import electron from 'electron';
const ipcRenderer = electron.ipcRenderer;

import AppPath from './app-path';
import Session from './session';
import Configuration from './configuration';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './containers/app.jsx';

AppPath.createAppPathIfDoNotExists();
Configuration.createDefaultIfDoNotExists();

let app;
let session = new Session();

session.load().then(function(doc) {
	var configuration = Configuration.load();
	app = ReactDOM.render(
		<App
			id={doc._id}
			value={doc.value}
			cursorPosition={doc.cursorPosition}
			result={doc.result}
			split={doc.split}
			message={doc.message}
			zoomFactor={doc.zoomFactor}
			theme={configuration.theme}
			/>,
		document.getElementById('app')
	);
});

function saveEditor(event) {

	const state = app.getState();

	session.save(state).then(function() {
		event.sender.send('close-ok');
	});
}

ipcRenderer.on('quantum:open', (event, message) => app.openFile());
ipcRenderer.on('quantum:save', (event, message) => app.saveFile());
ipcRenderer.on('quantum:edit-connection', (event, message) => app.editConnection());
ipcRenderer.on('quantum:execute', (event, message) => app.executeSQL());
ipcRenderer.on('quantum:format', (event, message) => app.formatSQL());
ipcRenderer.on('close', (event, message) => saveEditor(event));
