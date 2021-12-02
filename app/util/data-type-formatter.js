
import dateFormat from 'dateformat';

class DataTypeFormatter {

	constructor() {
		this.formatters = {
			date : (value) => dateFormat(value, 'yyyy-mm-dd'),
			json : (value) => JSON.stringify(value),
			timestampWithoutTimezone : (value) => dateFormat(value, 'yyyy-mm-dd HH:MM:ss.l'),
			timestamp : (value) => dateFormat(value, 'yyyy-mm-dd HH:MM:ss.lo'),
			undefined : (value) => Array.isArray(value) ? `{${value.map(String)}}` : String(value)
		};
		for (const [key, value] of Object.entries(this.formatters)) {
			if (key !== 'undefined') {
				this.formatters[`${key}[]`] = (values) => `{${values.map(value)}}`;
			}
		}
	}

	format(type, value) {
		if (value == null) {
			return value;
		}
		return this.formatters[type](value);
	}

}

export default new DataTypeFormatter();
