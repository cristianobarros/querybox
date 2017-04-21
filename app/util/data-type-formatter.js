
import dateFormat from "dateformat";

class DataTypeFormatter {

	constructor() {
		this.formatters = {
			date : (value) => dateFormat(value, "yyyy-mm-dd"),
			timestampWithoutTimezone : (value) => dateFormat(value, "yyyy-mm-dd HH:MM:ss.l"),
			timestamp : (value) => dateFormat(value, "yyyy-mm-dd HH:MM:ss.l"),
			undefined : (value) => String(value)
		};
	}

	format(type, value) {
		if (value == null) {
			return value;
		}
		return this.formatters[type](value);
	}

}

export default new DataTypeFormatter();
