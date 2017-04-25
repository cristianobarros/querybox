import React, {PureComponent} from 'react';

import $ from 'jquery';
import 'bootstrap';
import 'brace/ext/themelist';

import InputHotkey from "./input-hotkey.jsx";

export default class ConfigurationModal extends PureComponent {

  constructor(props) {
    super(props);
    this.state = Object.assign({
      themes : this.getThemes()
    }, props.configuration);
  }

  getThemes() {
    const bright = [];
    const dark = [];
    const list = ace.acequire("ace/ext/themelist");
    for (let theme of list.themes) {
      if (theme.name == 'gruvbox') {
        continue; // Appears into the list due to a bug, it's not avaliable.
      }
      if (theme.isDark) {
        dark.push(theme);
      } else {
        bright.push(theme);
      }
    }
    return {
      bright : bright.sort((a, b) => a.caption.localeCompare(b.caption)),
      dark : dark.sort((a, b) => a.caption.localeCompare(b.caption))
    };
  }

  componentDidMount() {
    $(this.refs.connectionModal).modal({
      show: false,
      keyboard: false,
      backdrop: "static"
    });
  }

  render() {
    return (
      <div className="modal fade" role="dialog" ref="connectionModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={() => this.cancel()}>&times;</button>
              <h4 className="modal-title">Configuration</h4>
            </div>
            <div className="modal-body">
              <div className="row" style={{ paddingLeft: '15px'}}>
              <ul className="nav nav-pills nav-stacked col-md-3">
                <li className="active"><a href="#themes" data-toggle="pill">Themes</a></li>
                <li><a href="#keybindings" data-toggle="pill">Keybindings</a></li>
              </ul>
              <div className="tab-content col-md-9" style={{ maxHeight: '300px', overflow: 'auto'}}>
                <div className="tab-pane active" id="themes">
                  <div className="form-group">
                    <label htmlFor="theme" className="control-label">Theme</label>
                    <select id="theme" value={this.state.theme} className="form-control" onChange={(event) => this.handleChange(event)}>
                      <optgroup label="Bright">
                        {this.renderThemes(this.state.themes.bright)}
                      </optgroup>
                      <optgroup label="Dark">
                        {this.renderThemes(this.state.themes.dark)}
                      </optgroup>
                    </select>
                  </div>
                </div>
                <div className="tab-pane" id="keybindings">
                  <div className="form-group">
                    <label htmlFor="newTab" className="control-label">New tab</label>
                    <InputHotkey id="newTab" className="form-control"
                      value={this.state.keybindings.newTab}
                      onChange={(value) => this.handleKeybindChange("newTab", value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="closeTab" className="control-label">Close tab</label>
                    <InputHotkey id="closeTab" className="form-control"
                      value={this.state.keybindings.closeTab}
                      onChange={(value) => this.handleKeybindChange("closeTab", value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="restoreTab" className="control-label">Restore tab</label>
                    <InputHotkey id="restoreTab" className="form-control"
                      value={this.state.keybindings.restoreTab}
                      onChange={(value) => this.handleKeybindChange("restoreTab", value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="previousTab" className="control-label">Previous tab</label>
                    <InputHotkey id="previousTab" className="form-control"
                      value={this.state.keybindings.previousTab}
                      onChange={(value) => this.handleKeybindChange("previousTab", value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nextTab" className="control-label">Next tab</label>
                    <InputHotkey id="nextTab" className="form-control"
                      value={this.state.keybindings.nextTab}
                      onChange={(value) => this.handleKeybindChange("nextTab", value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="executeQuery" className="control-label">Execute query</label>
                    <InputHotkey id="executeQuery" className="form-control"
                      value={this.state.keybindings.executeQuery}
                      onChange={(value) => this.handleKeybindChange("executeQuery", value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="formatQuery" className="control-label">Format query</label>
                    <InputHotkey id="formatQuery" className="form-control"
                      value={this.state.keybindings.formatQuery}
                      onChange={(value) => this.handleKeybindChange("formatQuery", value)} />
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={() => this.cancel()}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={() => this.save()}>Save</button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  renderThemes(themes) {
    return themes.map((theme, index) => {
      return (<option value={theme.name} key={index}>{theme.caption}</option>);
    });
  }

  handleChange(event) {

    const newState = {};

    const key = event.target.id;
    const value = event.target.value;

    newState[key] = value;

    this.setState(newState);
    this.props.onChange(newState);
  }

  handleKeybindChange(key, value) {

    const newState = Object.assign({}, this.state);

    newState.keybindings[key] = value;

    this.setState(newState);
    this.props.onChange(newState);
  }

  show() {
    this.setState(this.props.configuration, () => {
      this.saved = $.extend(true, {}, this.props.configuration);
      $(this.refs.connectionModal).modal('show');
    });
  }

  cancel() {
    this.props.onChange(this.saved);
    $(this.refs.connectionModal).modal('hide');
  }

  save() {
    const data = {
      theme: this.state.theme,
      keybindings: {
        executeQuery: this.state.keybindings.executeQuery,
      },
    };
    this.props.onSave(data);
    $(this.refs.connectionModal).modal('hide');
  }

}
