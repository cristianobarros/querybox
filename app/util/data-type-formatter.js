"use strict";

import dateFormat from "dateformat";

function DataTypeFormatter() {

	const formatters = {
		date : (value) => dateFormat(value, "yyyy-mm-dd"),
		timestampWithoutTimezone : (value) => dateFormat(value, "yyyy-mm-dd HH:MM:ss.l"),
		timestamp : (value) => dateFormat(value, "yyyy-mm-dd HH:MM:ss.l"),
		undefined : (value) => String(value)
	}

	function format(type, value) {
		if (value == null) {
			return value;
		}
		return formatters[type](value);
	}

	return {
		format : format
	}

}

module.exports = new DataTypeFormatter();
