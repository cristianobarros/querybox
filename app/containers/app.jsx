import React, {PureComponent} from 'react';

import Configuration from "./../configuration";

import QueryActions from './../actions/query-actions';

import TabContent from './../components/tab-content.jsx';
import ConnectionModal from './../components/connection-modal.jsx';
import ConfigurationModal from './../components/configuration-modal.jsx';

import DatabaseFactory from './../db/database-factory';

import Session from './../session';

export default class App extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      configuration : props.configuration,
      activeTabIndex : props.state.activeTabIndex,
      tabs : props.state.tabs
    };
  }

  render() {
    return (
      <div id="container">
        <ul className="nav nav-tabs">{this.renderTabs()}</ul>
        {this.renderTabsContents()}
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

   renderTabs() {
     let activeTabIndex = this.state.activeTabIndex;
     return this.state.tabs.map((tab, index) => {
       let className = index == activeTabIndex ? "active" : null;
       return (
         <li className={className} key={tab.uuid} onClick={() => this.onClickTab(index)}>
           <a href="javascript:void(0)">{tab.name}</a>
         </li>
       );
     });
   }

   onClickTab(index) {
     this.setState({
       activeTabIndex : index
     });
   }

   renderTabsContents() {
     let activeTabIndex = this.state.activeTabIndex;
     return this.state.tabs.map((tab, index) => {
       const active = index == activeTabIndex;
       return (
         <TabContent
           key={tab.uuid}
           active={active}
           ref={"tabContent-" + index}
           state={tab.content}
           theme={this.state.configuration.theme}
           />
       );
     });
   }

   newTab() {
     this.setState(function(prevState) {
       let newTabs = Array.from(prevState.tabs);
       newTabs.push(Session.getDefaultTab(newTabs.length + 1));
       return {
         activeTabIndex : newTabs.length - 1,
         tabs : newTabs
       };
     });
   }

   closeTab() {

     if (this.state.tabs.length == 1) {
       return false;
     }

     this.setState(function(prevState) {

       let index = prevState.activeTabIndex;
       let newTabs = Array.from(prevState.tabs);

       newTabs.splice(index, 1);

       let newTabIndex = index - 1;

       if (newTabIndex < 0) {
         newTabIndex = 0;
       }

       return {
         activeTabIndex : newTabIndex,
         tabs : newTabs
       };
     });

   }

   previousTab() {
     this.setState(function(prevState) {
       let newTabIndex = prevState.activeTabIndex - 1;
       if (newTabIndex < 0) {
         newTabIndex = prevState.tabs.length - 1;
       }
       return {
         activeTabIndex : newTabIndex
       };
     });
   }

   nextTab() {
     this.setState(function(prevState) {
       let newTabIndex = prevState.activeTabIndex + 1;
       if (newTabIndex >= prevState.tabs.length) {
         newTabIndex = 0;
       }
       return {
         activeTabIndex : newTabIndex
       };
     });
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

   getActiveTabContent() {
     return this.getTabContent(this.state.activeTabIndex);
   }

   getTabContent(index) {
     return this.refs["tabContent-" + index];
   }

   formatSQL() {
     return this.getActiveTabContent().formatSQL();
   }

   getSQL() {
     return this.getActiveTabContent().getSqlToExecute();
   }

   undo() {
     return this.getActiveTabContent().undo();
   }

   redo() {
     return this.getActiveTabContent().redo();
   }

   find() {
     return this.getActiveTabContent().find();
   }

   replace() {
     return this.getActiveTabContent().replace();
   }

   getSql() {
     return this.getActiveTabContent().getSql();
   }

   setSql(v) {
     this.getActiveTabContent().setSql(v);
   }

   setResult(r) {
     this.getActiveTabContent().setResult(r);
   }

   setMessage(m) {
     this.getActiveTabContent().setMessage(m);
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
     const self = this;
     return {
       _id : this.props.state._id,
       activeTabIndex : this.state.activeTabIndex,
       tabs : this.state.tabs.map((tab, index) => {
         return {
           uuid : tab.uuid,
           name : tab.name,
           content : self.getTabContent(index).getState()
         };
       })
     }
   }

}
