import React, {PureComponent} from 'react';

import $ from 'jquery';
import 'bootstrap';
import 'brace/ext/themelist';

import Configuration from "./../configuration";

import DatabaseFactory from './../db/database-factory';

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

  show() {
    this.setState(this.props.configuration, () => {
      this.saved = Object.assign({}, this.props.configuration);
      $(this.refs.connectionModal).modal('show');
    });
  }

  cancel() {
    this.props.onChange(this.saved);
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
