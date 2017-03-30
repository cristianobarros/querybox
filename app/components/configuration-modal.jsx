import React, {PureComponent} from 'react';

import $ from 'jquery';
import 'bootstrap';

import Configuration from "./../configuration";

import DatabaseFactory from './../db/database-factory';

export default class ConfigurationModal extends PureComponent {

  constructor(props) {
    super(props);
    this.state = props.configuration;
  }

  componentDidMount() {
    $(this.refs.connectionModal).modal({
      show: false,
      closable: true,
      detachable: false,
      allowMultiple: true,
      observeChanges: true,
      onHidden: () => this.onCancel(),
    });
  }

  componentWillUnmount() {
    this.onCancel();
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
              <div className="form-group">
                <label htmlFor="theme" className="control-label">Theme</label>
                <select id="theme" value={this.state.theme} className="form-control" onChange={(event) => this.handleChange(event)}>
                  <optgroup label="Bright">
                    <option value="chrome">Chrome</option>
                    <option value="clouds">Clouds</option>
                    <option value="crimson_editor">Crimson Editor</option>
                    <option value="dawn">Dawn</option>
                    <option value="dreamweaver">Dreamweaver</option>
                    <option value="eclipse">Eclipse</option>
                    <option value="github">GitHub</option>
                    <option value="iplastic">IPlastic</option>
                    <option value="solarized_light">Solarized Light</option>
                    <option value="textmate">TextMate</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="xcode">XCode</option>
                    <option value="kuroir">Kuroir</option>
                    <option value="katzenmilch">KatzenMilch</option>
                    <option value="sqlserver">SQL Server</option>
                  </optgroup>
                  <optgroup label="Dark">
                    <option value="ambiance">Ambiance</option>
                    <option value="chaos">Chaos</option>
                    <option value="clouds_midnight">Clouds Midnight</option>
                    <option value="cobalt">Cobalt</option>
                    <option value="gruvbox">Gruvbox</option>
                    <option value="idle_fingers">idle Fingers</option>
                    <option value="kr_theme">krTheme</option>
                    <option value="merbivore">Merbivore</option>
                    <option value="merbivore_soft">Merbivore Soft</option>
                    <option value="mono_industrial">Mono Industrial</option>
                    <option value="monokai">Monokai</option>
                    <option value="pastel_on_dark">Pastel on dark</option>
                    <option value="solarized_dark">Solarized Dark</option>
                    <option value="terminal">Terminal</option>
                    <option value="tomorrow_night">Tomorrow Night</option>
                    <option value="tomorrow_night_blue">Tomorrow Night Blue</option>
                    <option value="tomorrow_night_bright">Tomorrow Night Bright</option>
                    <option value="tomorrow_night_eighties">Tomorrow Night 80s</option>
                    <option value="twilight">Twilight</option>
                    <option value="vibrant_ink">Vibrant Ink</option>
                  </optgroup>
                </select>
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

  handleChange(event) {

    const newState = {};

    const key = event.target.id;
    const value = event.target.value;

    newState[key] = value;

    this.setState(newState);
  }

  show() {
    this.setState(Configuration.load());
    $(this.refs.connectionModal).modal('show');
  }

  cancel() {
    $(this.refs.connectionModal).modal('hide');
  }

  save() {
    const data = {
      theme : this.state.theme
    }
    this.props.onSave(data);
    $(this.refs.connectionModal).modal('hide');
  }

}
