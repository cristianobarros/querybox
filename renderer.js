// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var ace = require("brace");

require("brace/mode/sql");
require("brace/theme/vibrant_ink");
require("brace/ext/language_tools");
require("brace/ext/statusbar");

var editor = ace.edit("editor");

editor.setTheme("ace/theme/vibrant_ink");
editor.getSession().setMode("ace/mode/sql");
editor.setFontSize("14px");
editor.setShowPrintMargin(false);
editor.setOptions({
	enableBasicAutocompletion: true
});

var StatusBar = ace.acequire("ace/ext/statusbar").StatusBar;
var statusBar = new StatusBar(editor, document.getElementById("status"));

editor.commands.addCommand({
	name: "execute",
	bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" },
	exec: function() {
		var text = editor.getSelectedText() || editor.getValue();
		alert(text);
	}
});
