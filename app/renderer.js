
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
let configuration = Configuration.load();

session.load().then(function(doc) {
	app = ReactDOM.render(
		<App
			state={doc}
			configuration={configuration}
			onChangeConfiguration={(data) => onChangeConfiguration(data)}
			onSaveConfiguration={(data) => onSaveConfiguration(data)}
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
ipcRenderer.on('quantum:edit-configuration', (event, message) => app.editConfiguration());
ipcRenderer.on('quantum:execute', (event, message) => app.executeSQL());
ipcRenderer.on('quantum:format', (event, message) => app.formatSQL());
ipcRenderer.on('quantum:undo', (event, message) => app.undo());
ipcRenderer.on('quantum:redo', (event, message) => app.redo());
ipcRenderer.on('quantum:find', (event, message) => app.find());
ipcRenderer.on('quantum:replace', (event, message) => app.replace());
ipcRenderer.on('close', (event, message) => saveEditor(event));
