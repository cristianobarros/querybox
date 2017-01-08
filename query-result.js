'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import ResultTable from './component/result-table.jsx';
import QueryInfo from './component/query-info.jsx';

function QueryResult() {

	function refresh(result, time) {
		ReactDOM.render(<QueryInfo length={result.rows.length} time={time} />, document.getElementById('info'));
		ReactDOM.render(<ResultTable result={result}  />, document.getElementById('result'));
	}

	return {
		refresh : refresh
	}
}

module.exports = QueryResult;
