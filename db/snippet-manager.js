'use strict';

function SnippetManager() {

	function getSnippets() {
		return (
			  "snippet lj\n"
			+	"\tLEFT JOIN \n"
			+ "snippet Lj\n"
			+	"\tLEFT JOIN \n"
			+ "snippet lJ\n"
			+	"\tLEFT JOIN \n"
			+ "snippet LJ\n"
			+	"\tLEFT JOIN \n"

			+ "snippet rj\n"
			+	"\tRIGHT JOIN \n"
			+ "snippet Rj\n"
			+	"\tRIGHT JOIN \n"
			+ "snippet rJ\n"
			+	"\tRIGHT JOIN \n"
			+ "snippet RJ\n"
			+	"\tRIGHT JOIN \n"

			+ "snippet gb\n"
			+	"\tGROUP BY \n"
			+ "snippet Gb\n"
			+	"\tGROUP BY \n"
			+ "snippet gB\n"
			+	"\tGROUP BY \n"
			+ "snippet GB\n"
			+	"\tGROUP BY \n"

			+ "snippet ob\n"
			+	"\tORDER BY \n"
			+ "snippet Ob\n"
			+	"\tORDER BY \n"
			+ "snippet oB\n"
			+	"\tORDER BY \n"
			+ "snippet OB\n"
			+	"\tORDER BY \n"
		);
	}

	return {
		getSnippets : getSnippets
	}

}

module.exports = new SnippetManager();
