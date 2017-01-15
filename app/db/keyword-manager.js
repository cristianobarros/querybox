'use strict';

function KeywordManager() {

	function getKeywords() {
		return [
			"SELECT",
			"AS",
			"FROM",
			"JOIN",
			"LEFT",
			"OUTER",
			"RIGHT",
			"INNER",
			"ON",
			"WHERE",
			"AND",
			"OR",
			"ORDER",
			"GROUP",
			"BY",
			"IN",
			"NOT",
			"ASC",
			"DESC",
			"UPDATE",
			"SET",
			"DELETE",
			"INSERT",
			"INTO",
			"VALUES",
			"VALUE",
			"COUNT",
			"SUM",
			"CAST",
			"HAVING",
			"LIKE",
			"UNION",
			"CASE",
			"WHEN",
			"THEN",
			"ELSE",
			"END",
			"ALTER",
			"TABLE",
			"DROP",
			"COLUMN",
			"IS",
			"NULL",
			"LIMIT"
		];
	}

	return {
		getKeywords : getKeywords
	}

}

module.exports = new KeywordManager();
