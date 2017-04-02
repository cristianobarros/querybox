import React, {PureComponent} from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/sql';
import 'brace/ext/searchbox';
import 'brace/ext/language_tools';

import Formatter from '../formatter';

export default class QueryEditor extends PureComponent {

  componentWillReceiveProps(nextProps) {
    require("brace/theme/" + nextProps.theme);
    if (this.props.tables !== nextProps.tables) {
      let editor = this.refs.queryBoxTextarea.editor;
      editor.completers = this.getCompleters(nextProps);
    }
  }

  componentWillMount() {
    require("brace/theme/" + this.props.theme);
  }

  componentDidMount() {
    let editor = this.refs.queryBoxTextarea.editor;
    editor.focus();
    editor.completers = this.getCompleters(this.props);
    editor.moveCursorToPosition(this.props.cursorPosition);
    editor.getSession().setUndoManager(new ace.UndoManager());
    this.registerSnippets();
  }

  render() {
    return (
      <AceEditor
        mode="sql"
        theme={this.props.theme}
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

  getCompleters(props) {

  		let completions = [];

      completions = completions.concat(this.mapCompletion(props.keywords, "keyword"));
      completions = completions.concat(this.mapCompletion(props.tables, "table"));

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
    let editor = this.getEditor();
  	var position = editor.session.selection.toJSON();
    editor.setValue(formatter.format(editor.getValue(), this.props.keywords));
  	editor.session.selection.fromJSON(position);
  }

  getSQL() {
    let editor = this.getEditor();
  	return editor.getSelectedText() || editor.getValue();
  }

  undo() {
    this.getEditor().execCommand("undo");
  }

  redo() {
    this.getEditor().execCommand("redo");
  }

  find() {
    this.getEditor().execCommand("find");
  }

  replace() {
    this.getEditor().execCommand("replace");
  }

  getEditor() {
    return this.refs.queryBoxTextarea.editor;
  }

}
