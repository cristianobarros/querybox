
class KeywordManager {

	getAllKeywords() {
		return [
			...this.getKeywords(),
			...this.getConstants(),
			...this.getFunctions(),
			...this.getTypes()
		];
	}

	getKeywords() {
		return (
			'SELECT|AS|FROM|JOIN|LEFT|OUTER|RIGHT|INNER|ON|WHERE|AND|OR|ORDER|' +
			'GROUP|BY|IN|NOT|ASC|DESC|UPDATE|SET|DELETE|INSERT|INTO|VALUES|VALUE|' +
			'CAST|HAVING|LIKE|UNION|CASE|WHEN|THEN|ELSE|END|ALTER|TABLE|DROP|' +
			'COLUMN|IS|NULL|LIMIT|RENAME|TO|ALL|OFFSET|CREATE|FOREIGN|REFERENCES|' +
			'DEFAULT|CROSS|NATURAL|DATABASE|GRANT|TYPE|PRIMARY|KEY|IF|BETWEEN|' +
			'DISTINCT|EXCEPT|INTERSECT'
		).split("|");
	}

	getConstants() {
		return (
			'TRUE|FALSE'
		).split('|');
	}

	getFunctions() {
		return (
			'AVG|COUNT|FIRST|LAST|MAX|MIN|SUM|UCASE|LCASE|MID|LEN|ROUND|RANK|NOW|' +
			'FORMAT|COALESCE|IFNULL|ISNULL|NVL|UPPER|LOWER|CURRENT_DATE|' +
			'CURRENT_TIMESTAMP|CURRENT_TIME|TRIM|SUBSTRING|SUBSTR|LENGTH|REPLACE'
		).split('|');
	}

	getTypes() {
		return (
			'INT|NUMERIC|DECIMAL|DATE|VARCHAR|CHAR|BIGINT|FLOAT|DOUBLE|BIT|BINARY|' +
			'TEXT|TIMESTAMP|MONEY|REAL|NUMBER|INTEGER'
		).split('|');
	}

}

export default new KeywordManager();
