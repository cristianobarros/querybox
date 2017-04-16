import {ipcRenderer, webFrame} from 'electron';

import React, {PureComponent} from 'react';

import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";
import Sortable from "sortablejs";

import Session from './../session';
import Configuration from "./../configuration";

import QueryActions from './../actions/query-actions';

import TabContent from './../components/tab-content.jsx';
import ConnectionModal from './../components/connection-modal.jsx';
import ConfigurationModal from './../components/configuration-modal.jsx';

import DatabaseFactory from './../db/database-factory';

export default class App extends PureComponent {

  constructor(props) {
    super(props);
    this.registerEvents();
    const configuration = Configuration.load();
    this.state = {
      configuration : configuration,
      activeTabIndex : configuration.activeTabIndex,
      tabs : props.state.tabs
    };
  }

  registerEvents() {
    ipcRenderer.on('quantum:newTab', (event, message) => this.newTab());
    ipcRenderer.on('quantum:closeTab', (event, message) => this.closeCurrentTab());
    ipcRenderer.on('quantum:previousTab', (event, message) => this.previousTab());
    ipcRenderer.on('quantum:nextTab', (event, message) => this.nextTab());
    ipcRenderer.on('quantum:open', (event, message) => this.openFile());
    ipcRenderer.on('quantum:save', (event, message) => this.saveFile());
    ipcRenderer.on('quantum:edit-connection', (event, message) => this.editConnection());
    ipcRenderer.on('quantum:edit-configuration', (event, message) => this.editConfiguration());
    ipcRenderer.on('quantum:execute', (event, message) => this.executeSQL());
    ipcRenderer.on('quantum:format', (event, message) => this.formatSQL());
    ipcRenderer.on('quantum:undo', (event, message) => this.undo());
    ipcRenderer.on('quantum:redo', (event, message) => this.redo());
    ipcRenderer.on('quantum:find', (event, message) => this.find());
    ipcRenderer.on('quantum:replace', (event, message) => this.replace());
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

     const self = this;
     Sortable.create(this.refs.tabs, {
       onEnd : function(e) {

         self.setState(function(prevState) {

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
         }, function() {
           self.focusQueryEditor();
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
    const self = this;
    this.setState(function(prevState) {
      return {
        activeTabIndex : 0,
        tabs : [prevState.tabs[index]]
      };
    }, function() {
      self.focusQueryEditor();
    });
   }

   onClickTab(index) {
     const self = this;
     this.setState({
       activeTabIndex : index
     }, function() {
       self.focusQueryEditor();
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
     const self = this;
     this.setState(function(prevState) {
       let newTabs = Array.from(prevState.tabs);
       newTabs.push(Session.getDefaultTab(newTabs.length + 1));
       return {
         activeTabIndex : newTabs.length - 1,
         tabs : newTabs
       };
     }, function() {
       self.focusQueryEditor();
     });
   }

   closeCurrentTab() {
     this.closeTab(this.state.activeTabIndex);
   }

   closeTab(index) {

     if (this.state.tabs.length == 1) {
       return false;
     }

     const self = this;
     this.setState(function(prevState) {

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
     }, function() {
       self.focusQueryEditor();
     });
   }

   previousTab() {
     const self = this;
     this.setState(function(prevState) {
       let newTabIndex = prevState.activeTabIndex - 1;
       if (newTabIndex < 0) {
         newTabIndex = prevState.tabs.length - 1;
       }
       return {
         activeTabIndex : newTabIndex
       };
     }, function() {
       self.focusQueryEditor();
     });
   }

   nextTab() {
     const self = this;
     this.setState(function(prevState) {
       let newTabIndex = prevState.activeTabIndex + 1;
       if (newTabIndex >= prevState.tabs.length) {
         newTabIndex = 0;
       }
       return {
         activeTabIndex : newTabIndex
       };
     }, function() {
       self.focusQueryEditor();
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
     Configuration.save(Object.assign({}, this.state.configuration, {
       zoomFactor : webFrame.getZoomFactor(),
       activeTabIndex : this.state.activeTabIndex
     }));
     Session.save(this.getState()).then(function() {
       event.sender.send('close-ok');
     });
   }

   getState() {
     const self = this;
     return {
       _id : this.props.state._id,
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
