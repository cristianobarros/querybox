import AppPath from './app-path';
import Session from './session';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './containers/app.jsx';
import Configuration from './configuration';

AppPath.createAppPathIfDoNotExists();
Configuration.createDefaultIfDoNotExists();

Session.loadOpened().then(function(tabs) {
	ReactDOM.render(<App tabs={tabs} />, document.getElementById('app'));
});
