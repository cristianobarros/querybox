
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
let configuration = Configuration.load();

Session.load().then(function(doc) {
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

	Session.save(state).then(function() {
		event.sender.send('close-ok');
	});
}

ipcRenderer.on('quantum:newTab', (event, message) => app.newTab());
ipcRenderer.on('quantum:closeTab', (event, message) => app.closeTab());
ipcRenderer.on('quantum:previousTab', (event, message) => app.previousTab());
ipcRenderer.on('quantum:nextTab', (event, message) => app.nextTab());
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
