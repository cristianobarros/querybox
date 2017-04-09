'use strict';

function Formatter() {

	let patterns = [/('[^']*')/g, /(\/\*[\w\'\s\r\n\*]*\*\/)/g, /(--.*)/g];

	function format(sql, keywords) {
		sql = sql.replace(/ +/g, " ");
		let tokens = readStringTokens(sql);
		sql = sql.toLowerCase();
		keywords.forEach(function(keyword) {
			sql = sql.replace(RegExp('\\b' + keyword + '\\b', 'gi'), keyword);
		});
		sql = replaceStringTokens(sql, tokens);
		return sql;
	}

	function readStringTokens(sql) {

		let tokens = [];
		let match;

		patterns.forEach(function(pattern) {
			while ((match = pattern.exec(sql)) !== null) {
				tokens.push(match);
			}
		});

		return tokens;
	}

	function replaceStringTokens(sql, tokens) {
		tokens.forEach(function(token) {
			sql = replaceString(sql, token.index, token[1]);
		});
		return sql;
	}

	function replaceString(original, index, replacement) {
		return original.substr(0, index) + replacement + original.substr(index + replacement.length);
	}

	return {
		format : format
	}
}

module.exports = new Formatter();
