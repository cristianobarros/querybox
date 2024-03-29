import React, {PureComponent} from 'react';
import AceEditor from 'react-ace';

import 'brace/ext/searchbox';
import 'brace/ext/language_tools';

import { v4 as uuidv4 } from 'uuid';

import '../util/mode';
import '../util/snippet';
import Formatter from '../util/formatter';

export default class QueryEditor extends PureComponent {

  constructor(props) {
    super(props);
    this.uuid = uuidv4();
  }

  componentWillReceiveProps(nextProps) {

    require('brace/theme/' + nextProps.theme);

    if (this.props.value !== nextProps.value) {
      this.clearError();
    }

    if (!nextProps.error) {
      this.clearError();
    } else if (this.props.error !== nextProps.error) {
      this.showError(nextProps.error);
    }

    if (this.props.tables !== nextProps.tables) {
      this.getEditor().completers = this.getCompleters(nextProps);
    }
  }

  componentWillMount() {
    require('brace/theme/' + this.props.theme);
  }

  componentDidMount() {
    let editor = this.getEditor();
    editor.focus();
    editor.completers = this.getCompleters(this.props);
    editor.commands.removeCommand('transposeletters');
    editor.moveCursorToPosition(this.props.cursorPosition);
    editor.getSession().setUndoManager(new ace.UndoManager());
    this.registerSnippets();
    if (this.props.error) {
      this.showError(this.props.error);
    }
  }

  render() {
    return (
      <AceEditor
        mode='querybox'
        name={this.uuid}
        theme={this.props.theme}
        height='100%'
        width='100%'
        fontSize={14}
        ref='queryBoxTextarea'
        value={this.props.value}
        showPrintMargin={false}
        editorProps={{ $blockScrolling : Infinity }}
        enableSnippets={true}
        enableBasicAutocompletion={true}
        onChange={this.props.onChange}
        />
    );
  }

  clearError() {
    this.getEditor().getSession().setAnnotations([]);
  }

  showError(error) {
    const annotation = Object.assign({
      text: error.message,
      type: 'error'
    }, this.getErrorPosition(error));
    this.getEditor().getSession().setAnnotations([annotation]);
  }

  getErrorPosition(error) {
    const offset = this.getErrorOffset();
    const sql = this.getSQL();
    const before = sql.substring(0, error.position - 1);
    const row = (before.match(/\n/g) || []).length;
    const column = before.substring(before.lastIndexOf('\n') + 1, before.length).length;
    return {
      row : row + offset.row,
      column : column + offset.column
    };
  }

  getErrorOffset() {
    let row = 0;
    let column = 0;
    if (this.getEditor().getSelectedText()) {
      const range = this.getEditor().getSelectionRange();
      row = range.start.row;
      // The column offset only makes sense when it is on the first line
      if (row == 0) {
        column = range.start.column;
      }
    }
    return {
      row : row,
      column : column
    }
  }

  registerSnippets() {
    let snippetManager = ace.acequire('ace/snippets').snippetManager;
    let snippets = snippetManager.parseSnippetFile(this.props.snippets);
    snippetManager.register(snippets);
  }

  getCompleters(props) {

  		let completions = [];

      completions = completions.concat(this.mapCompletion(props.keywords, 'keyword'));
      completions = completions.concat(this.mapCompletion(props.tables, 'table'));

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
    let editor = this.getEditor();
  	var position = editor.session.selection.toJSON();
    editor.setValue(Formatter.format(editor.getValue(), this.props.keywords));
  	editor.session.selection.fromJSON(position);
  }

  getSQL() {

    const editor = this.getEditor();

    if (editor.getSelectedText()) {
      return editor.getSelectedText();
    }

    const cursorRowIndex = editor.getCursorPosition().row;

    const sql = editor.getValue();

    const rows = sql.split('\n');

    const startRowIndex = this.getStartRowIndex(rows, cursorRowIndex);
    const endRowIndex = this.getEndRowIndex(rows, cursorRowIndex);

    const resultSql = rows.slice(startRowIndex, endRowIndex + 1).join('\n');

    return resultSql;
  }

  getStartRowIndex(rows, cursorRowIndex) {
    let rowIndex = cursorRowIndex;
    for (let i = cursorRowIndex; i >= 0; i--) {
      if (this.isEmpty(rows[i])) {
        break;
      }
      rowIndex = i;
    }
    return rowIndex;
  }

  getEndRowIndex(rows, cursorRowIndex) {
    let rowIndex = cursorRowIndex;
    for (let i = cursorRowIndex; i < rows.length; i++) {
      if (this.isEmpty(rows[i])) {
        break;
      }
      rowIndex = i;
    }
    return rowIndex;
  }

  isEmpty(text) {
    return text.trim() == '';
  }

  undo() {
    this.getEditor().execCommand('undo');
  }

  redo() {
    this.getEditor().execCommand('redo');
  }

  find() {
    this.getEditor().execCommand('find');
  }

  replace() {
    this.getEditor().execCommand('replace');
  }

  getEditor() {
    return this.refs.queryBoxTextarea.editor;
  }

}
