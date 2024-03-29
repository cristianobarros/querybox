import React, {PureComponent} from 'react';
import ace from 'brace';
import 'brace/ext/statusbar';

import Split from 'split.js';
import {ResizeSensor} from 'css-element-queries';

import QueryInfo from './query-info.jsx';
import QueryEditor from './query-editor.jsx';
import ResultTable from './result-table.jsx';
import ErrorPanel from './error-panel.jsx';

import KeywordManager from './../db/keyword-manager';
import SnippetManager from './../db/snippet-manager';
import DatabaseFactory from './../db/database-factory';

export default class TabContent extends PureComponent {

  constructor(props) {
    super(props);
    this.mountedResizeSensor = false;
    this.state = {
      sql : props.state.sql,
      result : props.state.result,
      message : props.state.message,
      split : props.state.split,
      error : props.state.error,
      tables : [],
      snippets : SnippetManager.getSnippets(),
      keywords : KeywordManager.getAllKeywords()
    };
  }

  componentDidMount() {
    this.mountStatusBar();
    this.mountSplit();
    this.loadTables();
    this.mountResizeSensor();
  }

  componentDidUpdate() {
    this.mountResizeSensor();
  }

  render() {
    return (
      <div className={"querybox-tab-content " + (this.props.active ? "active" : "")}>
        <div ref="editor" className="editor">
          <QueryEditor
            ref="aceEditor"
            value={this.state.sql}
            snippets={this.state.snippets}
            keywords={this.state.keywords}
            tables={this.state.tables}
            cursorPosition={this.props.state.cursorPosition}
            onChange={(newValue) => this.setSql(newValue)}
            theme={this.props.theme}
            error={this.state.error}
            />
        </div>
        <div ref="result" className="result">
          <ResultTable
            ref="resultTable"
            result={this.state.result}
            />
          {this.state.error ? this.renderErrorPanel() : null}
        </div>
        <div ref="statusBar" className="status-bar"><QueryInfo message={this.state.message} /></div>
      </div>
    );
  }

  renderErrorPanel() {
    return (
      <ErrorPanel
        error={this.state.error}
        />
    );
  }

  mountStatusBar() {

    let editor = this.getEditor();

    let StatusBar = ace.acequire("ace/ext/statusbar").StatusBar;
    let statusBar = new StatusBar(editor, this.refs.statusBar);

    statusBar.updateStatus(editor);
  }

  mountSplit() {

    const editor = this.getEditor();
    const split = Split([this.refs.editor, this.refs.result], {
      sizes : this.state.split,
      direction : "vertical",
      onDrag: () => {
        this.setState({ split : split.getSizes() });
        editor.resize();
      }
    });

    editor.resize();
  }

  async loadTables() {
    try {
      if (DatabaseFactory.hasConfig()) {
        const result = await DatabaseFactory.create().getTableNames();
        this.setState({
          tables : result.rows.map(row => row[0])
        });
      }
    } catch (error) {
      this.setState({
        message : error.message
      });
    }
  }

  mountResizeSensor() {
    if (this.props.active && !this.mountedResizeSensor) {
      this.mountedResizeSensor = true;
      const parent = this.refs.result;
      this.refs.resultTable.updateSize(parent).then(() => {
        new ResizeSensor(parent, () => {
          this.refs.resultTable.updateSize(parent);
        });
      });
    }
  }

  formatSQL() {
    return this.refs.aceEditor.formatSQL();
  }

  getEditor() {
    return this.refs.aceEditor.refs.queryBoxTextarea.editor;
  }

  getSql() {
    return this.getEditor().getValue();
  }

  setSql(v) {
    this.setState({
      sql : v
    });
  }

  setResult(r) {
    let comp = this;
    this.setState({
      result : r,
      error : null,
    }, function() {
      comp.refs.resultTable.resetColumnsWidths();
    });
  }

  setError(e) {
    this.setState({
      result : null,
      error : JSON.parse(JSON.stringify(e)),
      message : e.message
    });
  }

  setMessage(m) {
    this.setState({
      message : m
    });
  }

  undo() {
    return this.refs.aceEditor.undo();
  }

  redo() {
    return this.refs.aceEditor.redo();
  }

  find() {
    return this.refs.aceEditor.find();
  }

  replace() {
    return this.refs.aceEditor.replace();
  }

  getSqlToExecute() {
    return this.refs.aceEditor.getSQL();
  }

  getCursorPosition() {
    return this.getEditor().getCursorPosition();
  }

  getState() {
    return {
      sql : this.state.sql,
      result : this.state.result,
      message : this.state.message,
      cursorPosition : this.getCursorPosition(),
      split : this.state.split,
      error : this.state.error
    };
  }

}
