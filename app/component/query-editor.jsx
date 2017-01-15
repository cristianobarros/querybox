import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/sql';
import 'brace/theme/chrome';
import 'brace/ext/language_tools';

import Formatter from '../formatter';

export default class QueryEditor extends React.PureComponent {

  componentDidMount() {
    let editor = this.refs.queryBoxTextarea.editor;
    editor.focus();
    editor.completers = this.getCompleters();
    editor.moveCursorToPosition(this.props.cursorPosition)
    this.registerSnippets();
  }

  render() {
    return (
      <AceEditor
        mode="sql"
        theme="chrome"
        name="querybox"
        height="100%"
        width="100%"
        fontSize={14}
        ref="queryBoxTextarea"
        value={this.props.value}
        showPrintMargin={false}
        editorProps={{ $blockScrolling : Infinity }}
        enableSnippets={true}
        enableBasicAutocompletion={true}
        onChange={this.props.onChange}
        />
    );
  }

  registerSnippets() {
      let snippetManager = ace.acequire("ace/snippets").snippetManager;
    	let snippets = snippetManager.parseSnippetFile(this.props.snippets);
    	snippetManager.register(snippets);
  }

  getCompleters() {

  		let completions = [];

  		completions = completions.concat(this.mapCompletion(this.props.keywords, "keyword"));
  		completions = completions.concat(this.mapCompletion(this.props.tables, "table"));

  		return [{
  		  getCompletions: function(editor, session, pos, prefix, callback) {
  		    callback(null, completions);
  		  }
  		}];
  }

  mapCompletion(items, meta) {
  	return items.map((item) => ({ caption : item, value : item, meta : meta }));
  }

  formatSQL() {
  	let formatter = new Formatter();
    let editor = this.refs.queryBoxTextarea.editor;
  	var position = editor.session.selection.toJSON();
  	editor.setValue(formatter.format(this.getSQL(), this.props.keywords));
  	editor.session.selection.fromJSON(position);
  }

  getSQL() {
    let editor = this.refs.queryBoxTextarea.editor;
  	return editor.getSelectedText() || editor.getValue();
  }

}
