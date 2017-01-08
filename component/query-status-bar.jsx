import React from 'react';
import ace from 'brace';
import 'brace/ext/statusbar';

export default class QueryStatusBar extends React.Component {

  componentDidMount() {
    let editor = this.props.editor;
    let StatusBar = ace.acequire("ace/ext/statusbar").StatusBar;
    let statusBar = new StatusBar(editor, document.getElementById("ace-status"));
    statusBar.updateStatus(editor);
  }

  render() {
    return (
      <div id="ace-status"><div id="info"></div></div>
    );
  }

}
