'use strict';

import QueryResult from './query-result';

function Result() {

	let queryResult = new QueryResult();

	function handleErrorIfExists(err) {
		if (err) {
			document.getElementById("info").innerHTML = err.message;
			throw err;
		}
	}

	function refresh(result, time) {
		queryResult.refresh(result, time);
	}

	return {
		refresh : refresh,
		handleErrorIfExists : handleErrorIfExists
	}
}

module.exports = Result;
