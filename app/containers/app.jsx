import React, {PureComponent} from 'react';
import ace from 'brace';
import 'brace/ext/statusbar';
import {Split} from 'split.js';

const {webFrame} = require('electron');

import Configuration from "./../configuration";

import QueryActions from './../actions/query-actions';

import QueryEditor from './../components/query-editor.jsx';
import QueryInfo from './../components/query-info.jsx';
import ResultTable from './../components/result-table.jsx';
import ConnectionModal from './../components/connection-modal.jsx';

import KeywordManager from './../db/keyword-manager';
import SnippetManager from './../db/snippet-manager';
import DatabaseFactory from './../db/database-factory';

export default class App extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      value : props.value,
      result : props.result,
      message : props.message,
      tables : [],
      snippets : SnippetManager.getSnippets(),
      keywords : KeywordManager.getKeywords(),
      theme : props.theme
    };
  }

  componentDidMount() {
    this.mountStatusBar();
    this.mountSplit();
    this.loadTables();
    webFrame.setZoomFactor(this.props.zoomFactor);
  }

  render() {

    let resultTable = null;

    if (this.state.result != null) {
      resultTable = <ResultTable result={this.state.result} />
    }

    return (
      <div id="container">
        <div id="editor">
          <QueryEditor
            ref="editor"
            value={this.state.value}
            snippets={this.state.snippets}
            keywords={this.state.keywords}
            tables={this.state.tables}
            cursorPosition={this.props.cursorPosition}
            onChange={(newValue) => this.setValue(newValue)}
            theme={this.state.theme}
            />
        </div>
        <div id="result">{resultTable}</div>
        <div id="status"><QueryInfo message={this.state.message} /></div>
        <ConnectionModal
          ref="connectionModal"
          onSave={(data) => this.onSaveConnection(data)}
          />
      </div>
      );
   }

   onSaveConnection(data) {
     DatabaseFactory.saveConfig(data);
     this.loadTables();
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
       DatabaseFactory.create().getTableNames(onSuccess, onError);
     } catch (error) {
       onError(error);
     }
   }

   mountStatusBar() {

     let editor = this.getEditor();

     let StatusBar = ace.acequire("ace/ext/statusbar").StatusBar;
     let statusBar = new StatusBar(editor, document.getElementById("status"));

     statusBar.updateStatus(editor);
   }

   mountSplit() {

     let editor = this.getEditor();

     this.split = Split(['#editor', '#result'], {
       sizes : this.props.split,
       direction : 'vertical',
       onDrag: () => editor.resize()
     });

     editor.resize();
   }

   getEditor() {
     return this.refs.editor.refs.queryBoxTextarea.editor;
   }

   getValue() {
     return this.getEditor().getValue();
   }

   getCursorPosition() {
     return this.getEditor().getCursorPosition();
   }

   getSplitSizes() {
     return this.split.getSizes();
   }

   formatSQL() {
     return this.refs.editor.formatSQL();
   }

   getSQL() {
     return this.refs.editor.getSQL();
   }

   setValue(v) {
     this.setState({
       value : v
     });
   }

   setResult(r) {
     this.setState({
       result : r
     });
   }

   setMessage(m) {
     this.setState({
       message : m
     });
   }

   openFile() {
     QueryActions.openFile(this);
   }

   saveFile() {
     QueryActions.saveFile(this);
   }

   editConnection() {
     this.refs.connectionModal.show();
   }

   executeSQL() {
     QueryActions.executeSQL(this);
   }

   getState() {
     return {
       _id : this.props.id,
       value : this.state.value,
       result : this.state.result,
       message : this.state.message,
       cursorPosition : this.getCursorPosition(),
       split : this.getSplitSizes(),
       zoomFactor : webFrame.getZoomFactor()
     }
   }

}
