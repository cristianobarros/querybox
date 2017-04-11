"use strict";

import dateFormat from "dateformat";

function DataTypeFormatter() {

	function format(type, value) {
		const formatters = {
			date : (value) => dateFormat(value, "yyyy-mm-dd"),
			timestampWithoutTimezone : (value) => dateFormat(value, "yyyy-mm-dd HH:MM:ss.l"),
			timestamp : (value) => dateFormat(value, "yyyy-mm-dd HH:MM:ss.l"),
			undefined : (value) => String(value)
		}
		return formatters[type](value);
	}

	return {
		format : format
	}

}

module.exports = new DataTypeFormatter();
