import React, {PureComponent} from 'react';

import $ from 'jquery';
import 'bootstrap';

import DatabaseFactory from './../db/database-factory';

const EMPTY_STATE = {
  "type" : "",
  "host" : "",
  "port" : "",
  "database" : "",
  "user" : "",
  "password" : ""
};

export default class ConnectionModal extends PureComponent {

  constructor() {
    super();
    this.state = EMPTY_STATE;
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
              <h4 className="modal-title">Connection</h4>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="type" className="control-label">Type</label>
                <select id="type" value={this.state.type} className="form-control" onChange={(event) => this.handleChange(event)}>
                  <option value=""></option>
                  <option value="MySQL">MySQL</option>
                  <option value="PostgreSQL">PostgreSQL</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="host" className="control-label">Host</label>
                <input type="text" id="host" value={this.state.host} className="form-control" onChange={(event) => this.handleChange(event)} />
              </div>
              <div className="form-group">
                <label htmlFor="port" className="control-label">Port</label>
                <input type="text" id="port" value={this.state.port} className="form-control" onChange={(event) => this.handleChange(event)} />
              </div>
              <div className="form-group">
                <label htmlFor="database" className="control-label">Database</label>
                <input type="text" id="database" value={this.state.database} className="form-control" onChange={(event) => this.handleChange(event)} />
              </div>
              <div className="form-group">
                <label htmlFor="user" className="control-label">User</label>
                <input type="text" id="user" value={this.state.user} className="form-control" onChange={(event) => this.handleChange(event)} />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="control-label">Password</label>
                <input type="text" id="password" value={this.state.password} className="form-control" onChange={(event) => this.handleChange(event)} />
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
    let newState;
    try {
      newState = DatabaseFactory.loadConfig();
    } catch (error) {
      newState = EMPTY_STATE;
    }
    this.setState(newState);
    $(this.refs.connectionModal).modal('show');
  }

  cancel() {
    $(this.refs.connectionModal).modal('hide');
  }

  save() {
    const data = {
      type : this.state.type,
      host : this.state.host,
      port : this.state.port,
      database : this.state.database,
      user : this.state.user,
      password : this.state.password
    }
    this.props.onSave(data);
    $(this.refs.connectionModal).modal('hide');
  }

}
