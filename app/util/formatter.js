
class Formatter {

	constructor() {
		this.patterns = [/('[^']*')/g, /(\/\*[\w\'\s\r\n\*]*\*\/)/g, /(--.*)/g];
	}

	format(sql, keywords) {
		sql = sql.replace(/ +/g, ' ');
		let tokens = this.readStringTokens(sql);
		sql = sql.toLowerCase();
		keywords.forEach(function(keyword) {
			sql = sql.replace(RegExp('\\b' + keyword + '\\b', 'gi'), keyword);
		});
		sql = this.replaceStringTokens(sql, tokens);
		return sql;
	}

	readStringTokens(sql) {

		let tokens = [];
		let match;

		this.patterns.forEach(function(pattern) {
			while ((match = pattern.exec(sql)) !== null) {
				tokens.push(match);
			}
		});

		return tokens;
	}

	replaceStringTokens(sql, tokens) {
		tokens.forEach(function(token) {
			sql = this.replaceString(sql, token.index, token[1]);
		});
		return sql;
	}

	replaceString(original, index, replacement) {
		return original.substr(0, index) + replacement + original.substr(index + replacement.length);
	}

}

export default new Formatter();
