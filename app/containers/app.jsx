import React, {PureComponent} from 'react';

import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";
import Sortable from "sortablejs";

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
          onSave={(data) => this.onSaveConfiguration(data)}
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
     const self = this;
     Sortable.create(this.refs.tabs, {
       onEnd : function(e) {

         self.setState(function(prevState) {

           let newTabs = Array.from(prevState.tabs);

           const tab = newTabs.splice(e.oldIndex, 1)[0];
           newTabs.splice(e.newIndex, 0, tab);

           let newTabIndex = prevState.activeTabIndex;

           if (e.oldIndex < newTabIndex) {
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
