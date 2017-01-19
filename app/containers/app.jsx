
const electron = require('electron');
const fs = require('fs');
const dialog = electron.remote.dialog;

import React, {PureComponent} from 'react';
import ace from 'brace';
import 'brace/ext/statusbar';
import {Split} from 'split.js';

import QueryEditor from './../components/query-editor.jsx';
import QueryInfo from './../components/query-info.jsx';
import ResultTable from './../components/result-table.jsx';

import Timer from './../timer';
import DatabaseFactory from './../db/database-factory';

export default class App extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      value : props.value,
      result : props.result,
      message : props.message
    };
  }

  componentDidMount() {
    this.mountStatusBar();
    this.mountSplit();
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
            snippets={this.props.snippets}
            keywords={this.props.keywords}
            tables={this.props.tables}
            cursorPosition={this.props.cursorPosition}
            onChange={(newValue) => this.setValue(newValue)}
            />
        </div>
        <div id="result">{resultTable}</div>
        <div id="status"><QueryInfo message={this.state.message} /></div>
      </div>
      );
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

     const self = this;
     const files = dialog.showOpenDialog({
       filters: [
         {name: 'SQL', extensions: ['sql']},
         {name: 'All Files', extensions: ['*']}
       ],
       properties: ['openFile']
     });

     if (files === undefined) {
       return;
     }

     fs.readFile(files[0], 'utf-8', function (error, data) {
       if (error) {
         self.setMessage(error.message);
       }
       self.setValue(data);
     });
   }

   saveFile() {

     const self = this;
     const file = dialog.showSaveDialog({
       filters: [
         {name: 'SQL', extensions: ['sql']},
         {name: 'All Files', extensions: ['*']}
       ]
     });

     if (file === undefined) {
       return;
     }

     fs.writeFile(file, self.getValue(), function (error) {
       if (error) {
         self.setMessage(error.message);
       }
     });
   }

   executeSQL() {

     const self = this;
     const timer = new Timer();

     timer.start();

     const onSuccess = function(result) {
        timer.stop();
        self.setMessage(result.rows.length + " rows in " + timer.getTime() + " ms");
        self.setResult(result);
      };

      const onError = function(error) {
        self.setMessage(error.message);
      };

      DatabaseFactory.create().execute(self.getSQL(), onSuccess, onError);
    }

   getState() {
     return {
       _id : this.props.id,
       value : this.state.value,
       result : this.state.result,
       message : this.state.message,
       cursorPosition : this.getCursorPosition(),
       split : this.getSplitSizes()
     }
   }

}
