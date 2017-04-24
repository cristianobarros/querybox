import {ipcRenderer, webFrame, remote} from 'electron';

import React, {PureComponent} from 'react';

import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";
import Sortable from "sortablejs";

import Session from './../util/session';

import QueryActions from './../actions/query-actions';

import TabContent from './../components/tab-content.jsx';
import ConnectionModal from './../components/connection-modal.jsx';
import ConfigurationModal from './../components/configuration-modal.jsx';

import DatabaseFactory from './../db/database-factory';

export default class App extends PureComponent {

  constructor(props) {
    super(props);
    this.registerEvents();
    const configuration = remote.getGlobal('configuration');
    this.state = {
      configuration : configuration,
      activeTabIndex : configuration.activeTabIndex,
      tabs : props.tabs
    };
  }

  registerEvents() {
    ipcRenderer.on('querybox:newTab', (event, message) => this.newTab());
    ipcRenderer.on('querybox:closeTab', (event, message) => this.closeCurrentTab());
    ipcRenderer.on('querybox:previousTab', (event, message) => this.previousTab());
    ipcRenderer.on('querybox:nextTab', (event, message) => this.nextTab());
    ipcRenderer.on('querybox:restoreTab', (event, message) => this.restoreTab());
    ipcRenderer.on('querybox:open', (event, message) => this.openFile());
    ipcRenderer.on('querybox:save', (event, message) => this.saveFile());
    ipcRenderer.on('querybox:edit-connection', (event, message) => this.editConnection());
    ipcRenderer.on('querybox:edit-configuration', (event, message) => this.editConfiguration());
    ipcRenderer.on('querybox:execute', (event, message) => this.executeSQL());
    ipcRenderer.on('querybox:format', (event, message) => this.formatSQL());
    ipcRenderer.on('querybox:undo', (event, message) => this.undo());
    ipcRenderer.on('querybox:redo', (event, message) => this.redo());
    ipcRenderer.on('querybox:find', (event, message) => this.find());
    ipcRenderer.on('querybox:replace', (event, message) => this.replace());
    ipcRenderer.on('close', (event, message) => this.close(event));
  }

  render() {
    return (
      <div id="container">
        <ul ref="tabs" className="nav nav-tabs">{this.renderTabs()}</ul>
        {this.renderTabsContents()}
        <ConnectionModal
          ref="connectionModal"
          onSave={(data) => this.onSaveConnection(data)}
          />
        <ConfigurationModal
          ref="configurationModal"
          configuration={this.state.configuration}
          onChange={(data) => this.onChangeConfiguration(data)}
          onSave={(data) => this.onChangeConfiguration(data)}
          />
        <ContextMenu id="TABS_CONTEXT_MENU">
          <MenuItem onClick={(e, data, target) => this.closeTab(data.index)}>Close tab</MenuItem>
          <MenuItem onClick={(e, data, target) => this.closeOtherTabs(data.index)}>Close other tabs</MenuItem>
        </ContextMenu>
      </div>
      );
   }

   renderTabs() {
     let activeTabIndex = this.state.activeTabIndex;
     return this.state.tabs.map((tab, index) => {
       let className = index == activeTabIndex ? "active" : null;
       return (
         <li className={className} key={tab.uuid} onClick={() => this.onClickTab(index)}>
           <ContextMenuTrigger
               id="TABS_CONTEXT_MENU"
               index={index}
               collect={this.collect}
               holdToDisplay={-1}
               attributes={{ href : "javascript:void(0)"}}
               renderTag="a">{tab.name}<i
                className="glyphicon glyphicon-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  this.closeTab(index);
                }}></i></ContextMenuTrigger>
         </li>
       );
     });
   }

   componentDidMount() {

     webFrame.setZoomFactor(this.state.configuration.zoomFactor);

     Sortable.create(this.refs.tabs, {
       onEnd : (e) => {

         this.setState(function(prevState) {

           let newTabs = Array.from(prevState.tabs);

           const tab = newTabs.splice(e.oldIndex, 1)[0];
           newTabs.splice(e.newIndex, 0, tab);

           let newTabIndex = prevState.activeTabIndex;

           if (e.oldIndex < newTabIndex && e.newIndex >= newTabIndex) {
             newTabIndex--;
           } else if (e.oldIndex == newTabIndex) {
             newTabIndex = e.newIndex;
           }

           return {
             activeTabIndex : newTabIndex,
             tabs : newTabs
           };
         }, () => {
           this.focusQueryEditor();
         });
       },
     });
   }

   collect(props) {
     return {
        index : props.index
     };
   }

   closeOtherTabs(index) {
     const indexes = Array.from(Array(this.state.tabs.length).keys());
     indexes.splice(index, 1);
     this.saveClosedTabs(indexes).then(() => {
       this.setState(function(prevState) {
         return {
           activeTabIndex : 0,
           tabs : [prevState.tabs[index]]
         };
       }, () => {
         this.focusQueryEditor();
       });
     });
   }

   onClickTab(index) {
     this.setState({
       activeTabIndex : index
     }, () => {
       this.focusQueryEditor();
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
     this.setState((prevState) => {
       let newTabs = Array.from(prevState.tabs);
       newTabs.push(Session.getDefaultTab(newTabs.length + 1));
       return {
         activeTabIndex : newTabs.length - 1,
         tabs : newTabs
       };
     }, () => {
       this.focusQueryEditor();
     });
   }

   closeCurrentTab() {
     this.closeTab(this.state.activeTabIndex);
   }

   closeTab(index) {

     if (this.state.tabs.length == 1) {
       return false;
     }

     this.saveClosedTabs([index]).then(() => {
       this.setState((prevState) => {

         let newTabs = Array.from(prevState.tabs);

         newTabs.splice(index, 1);

         let newTabIndex = prevState.activeTabIndex;

         if (index < newTabIndex || newTabIndex >= newTabs.length) {
           newTabIndex--;
         }

         return {
           activeTabIndex : newTabIndex,
           tabs : newTabs
         };
       }, () => {
         this.focusQueryEditor();
       });
     });
   }

   saveClosedTabs(indexes) {
     const tabs = indexes.map((index) => Object.assign({}, this.getTab(index), { closedOn : new Date() }));
     return Session.saveAll(tabs);
   }

   previousTab() {
     this.setState((prevState) => {
       let newTabIndex = prevState.activeTabIndex - 1;
       if (newTabIndex < 0) {
         newTabIndex = prevState.tabs.length - 1;
       }
       return {
         activeTabIndex : newTabIndex
       };
     }, () => {
       this.focusQueryEditor();
     });
   }

   nextTab() {
     this.setState((prevState) => {
       let newTabIndex = prevState.activeTabIndex + 1;
       if (newTabIndex >= prevState.tabs.length) {
         newTabIndex = 0;
       }
       return {
         activeTabIndex : newTabIndex
       };
     }, () => {
       this.focusQueryEditor();
     });
   }

   restoreTab() {
     Session.getLastClosed().then((docs) => {

       if (docs.length == 0) {
         return;
       }

       Session.save(Object.assign({}, docs[0], { closedOn : null})).then(() => {
         this.setState(function(prevState) {
           const newTabs = Array.from(prevState.tabs);
           newTabs.push(docs[0]);
           return {
             activeTabIndex : prevState.tabs.length,
             tabs : newTabs
           };
         }, () => {
           this.focusQueryEditor();
         });
       });
     });
   }

   focusQueryEditor() {
     this.getActiveTabContent().refs.aceEditor.refs.queryBoxTextarea.editor.focus();
   }

   onSaveConnection(data) {
     DatabaseFactory.saveConfig(data);
     this.getActiveTabContent().loadTables();
   }

   onChangeConfiguration(data) {
     this.setState({ configuration : data });
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

   setError(error) {
     this.getActiveTabContent().setError(error);
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

   close(event) {
     Object.assign(remote.getGlobal('configuration'), this.state.configuration, {
       zoomFactor : webFrame.getZoomFactor(),
       activeTabIndex : this.state.activeTabIndex
     });
     const tabs = this.getTabs();
     Session.saveAll(tabs).then(function() {
       event.sender.send('close-ok');
     });
   }

   getTabs() {
     return this.state.tabs.map((tab, index) => {
       return this.getTab(index);
     });
   }

   getTab(index) {
     const tab = this.state.tabs[index];
     return {
       _id : tab._id,
       uuid : tab.uuid,
       name : tab.name,
       index : index,
       closedOn : null,
       content : this.getTabContent(index).getState()
     };
   }

}
