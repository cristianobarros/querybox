'use strict';

import dateFormat from 'dateformat';

function ObjectFormatter() {

	function format(value) {
		if (value instanceof Date) {
			return dateFormat(value, 'yyyy-mm-dd HH:MM:ss.l');
		}
		return value;
	}

	return {
		format : format
	}
}

module.exports = new ObjectFormatter();
