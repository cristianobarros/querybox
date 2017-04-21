import AppPath from './util/app-path';
import Session from './util/session';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './containers/app.jsx';
import Configuration from './util/configuration';

AppPath.createAppPathIfDoNotExists();
Configuration.createDefaultIfDoNotExists();

Session.loadOpened().then((tabs) => {
	ReactDOM.render(<App tabs={tabs} />, document.getElementById('app'));
});
