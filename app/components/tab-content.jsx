import React, {PureComponent} from 'react';
import ace from 'brace';
import 'brace/ext/statusbar';

import {Split} from 'split.js';
import {webFrame} from 'electron';

import QueryInfo from './../components/query-info.jsx';
import QueryEditor from './../components/query-editor.jsx';
import ResultTable from './../components/result-table.jsx';

import KeywordManager from './../db/keyword-manager';
import SnippetManager from './../db/snippet-manager';
import DatabaseFactory from './../db/database-factory';

export default class TabContent extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      sql : props.state.sql,
      result : props.state.result,
      message : props.state.message,
      tables : [],
      snippets : SnippetManager.getSnippets(),
      keywords : KeywordManager.getKeywords()
    };
  }

  componentDidMount() {
    this.mountStatusBar();
    this.mountSplit();
    this.loadTables();
    webFrame.setZoomFactor(this.props.state.zoomFactor);
  }

  render() {
    return (
      <div className={"tab-content " + (this.props.active ? "active" : "")}>
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
            />
        </div>
        <ResultTable
          ref="resultTable"
          result={this.state.result}
          visible={this.props.active}
          />
        <div ref="statusBar" className="status-bar"><QueryInfo message={this.state.message} /></div>
      </div>
    );
  }

  mountStatusBar() {

    let editor = this.getEditor();

    let StatusBar = ace.acequire("ace/ext/statusbar").StatusBar;
    let statusBar = new StatusBar(editor, this.refs.statusBar);

    statusBar.updateStatus(editor);
  }

  mountSplit() {

    let editor = this.getEditor();

    this.split = Split([this.refs.editor, this.refs.resultTable.refs.result], {
      sizes : this.props.state.split,
      direction : 'vertical',
      onDrag: () => editor.resize()
    });

    editor.resize();
  }

  loadTables() {

    const self = this;

    const onSuccess = function(res) {
      const newTables = res.rows.map((row) => row[0]);
      self.setState({
        tables : newTables
      });
    };

    const onError = function(error) {
      self.setState({
        message : error.message
      });
    };

    try {
      if (DatabaseFactory.hasConfig()) {
        DatabaseFactory.create().getTableNames(onSuccess, onError);
      }
    } catch (error) {
      onError(error);
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
      result : r
    }, function() {
      comp.refs.resultTable.resetColumnsWidths();
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

  getSplitSizes() {
    return this.split.getSizes();
  }

  getState() {
    return {
      sql : this.state.sql,
      result : this.state.result,
      message : this.state.message,
      cursorPosition : this.getCursorPosition(),
      split : this.getSplitSizes(),
      zoomFactor : webFrame.getZoomFactor()
    };
  }

}
