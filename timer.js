'use strict';

function Timer() {

	let startDate;
	let stopDate;

	function start() {
		startDate = new Date();
	}

	function stop() {
		stopDate = new Date();
	}

	function getTime() {
		return stopDate - startDate;
	}

	return {
		start : start,
		stop : stop,
		getTime : getTime
	}
}

module.exports = Timer;