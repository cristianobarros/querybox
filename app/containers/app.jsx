import React, {PureComponent} from 'react';
import ace from 'brace';
import 'brace/ext/statusbar';
import {Split} from 'split.js';

import QueryActions from './../actions/query-actions';

import QueryEditor from './../components/query-editor.jsx';
import QueryInfo from './../components/query-info.jsx';
import ResultTable from './../components/result-table.jsx';

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
     QueryActions.openFile(this);
   }

   saveFile() {
     QueryActions.saveFile(this);
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
       split : this.getSplitSizes()
     }
   }

}
