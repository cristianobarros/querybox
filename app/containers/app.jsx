import React, {PureComponent} from 'react';

import Configuration from "./../configuration";

import QueryActions from './../actions/query-actions';

import TabContent from './../components/tab-content.jsx';
import ConnectionModal from './../components/connection-modal.jsx';
import ConfigurationModal from './../components/configuration-modal.jsx';

import DatabaseFactory from './../db/database-factory';

export default class App extends PureComponent {

  constructor(props) {
    super(props);
    this.state = { configuration : props.configuration };
  }

  render() {
    return (
      <div id="container">
        <TabContent
          ref="tabContent"
          state={this.props.state.tabs[0].content}
          theme={this.state.configuration.theme}
          />
        <ConnectionModal
          ref="connectionModal"
          onSave={(data) => this.onSaveConnection(data)}
          />
        <ConfigurationModal
          ref="configurationModal"
          configuration={this.state.configuration}
          onChange={(data) => this.onChangeConfiguration(data)}
          onSave={(data) => this.onSaveConfiguration(data)}
          />
      </div>
      );
   }

   onSaveConnection(data) {
     DatabaseFactory.saveConfig(data);
     this.refs.tabContent.loadTables();
   }

   onChangeConfiguration(data) {
     this.setState({ configuration : data });
   }

   onSaveConfiguration(data) {
     this.onChangeConfiguration(data);
     Configuration.save(data);
   }

   formatSQL() {
     return this.refs.tabContent.formatSQL();
   }

   getSQL() {
     return this.refs.tabContent.getSqlToExecute();
   }

   undo() {
     return this.refs.tabContent.undo();
   }

   redo() {
     return this.refs.tabContent.redo();
   }

   find() {
     return this.refs.tabContent.find();
   }

   replace() {
     return this.refs.tabContent.replace();
   }

   getSql() {
     return this.refs.tabContent.getSql();
   }

   setSql(v) {
     this.refs.tabContent.setSql(v);
   }

   setResult(r) {
     this.refs.tabContent.setResult(r);
   }

   setMessage(m) {
     this.refs.tabContent.setMessage(m);
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

   editConfiguration() {
     this.refs.configurationModal.show();
   }

   executeSQL() {
     QueryActions.executeSQL(this);
   }

   getState() {
     return {
       _id : this.props.state._id,
       activeTabIndex : 0,
       tabs : [{
         name : "Tab 1",
         content : this.refs.tabContent.getState()
       }]
     }
   }

}
