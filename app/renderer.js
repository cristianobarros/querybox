import AppPath from './app-path';
import Session from './session';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './containers/app.jsx';
import Configuration from './configuration';

AppPath.createAppPathIfDoNotExists();
Configuration.createDefaultIfDoNotExists();

Session.load().then(function(doc) {
	ReactDOM.render(<App state={doc} />, document.getElementById('app'));
});
