import Session from './util/session';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './containers/app.jsx';

Session.loadOpened().then((tabs) => {
	ReactDOM.render(<App tabs={tabs} />, document.getElementById('app'));
});
