// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var editor = ace.edit("editor");
editor.setTheme("ace/theme/vibrant_ink");
editor.getSession().setMode("ace/mode/sql");
editor.setFontSize("14px");
editor.setShowPrintMargin(false);
editor.setOptions({
	enableBasicAutocompletion: true
});
var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
var statusBar = new StatusBar(editor, document.getElementById("status"));