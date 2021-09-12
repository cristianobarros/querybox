import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

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

const ConnectionModal = React.memo(forwardRef((props, ref) => {

  const connectionModal = useRef();
  const [ state, setState ] = useState(EMPTY_STATE);

  useEffect(() => {
    $(connectionModal.current).modal({
      show: false,
      keyboard: false,
      backdrop: "static"
    });
  }, []);

  const handleChange = event => {
    const key = event.target.id;
    const value = event.target.value;
    setState(prevState => Object.assign({}, prevState, { [key]: value }));
  };

  const cancel = () => {
    $(connectionModal.current).modal('hide');
  };

  const save = () => {
    const data = {
      type : state.type,
      host : state.host,
      port : state.port,
      database : state.database,
      user : state.user,
      password : state.password
    }
    props.onSave(data);
    $(connectionModal.current).modal('hide');
  }

  useImperativeHandle(ref, () => ({
    show() {
      let newState;
      try {
        newState = DatabaseFactory.loadConfig();
      } catch (error) {
        newState = EMPTY_STATE;
      }
      setState(newState);
      $(connectionModal.current).modal('show');
    }
  }));

  return (
    <div className="modal fade" role="dialog" ref={connectionModal}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={() => cancel()}>&times;</button>
            <h4 className="modal-title">Connection</h4>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="type" className="control-label">Type</label>
              <select id="type" value={state.type} className="form-control" onChange={(event) => handleChange(event)}>
                <option value=""></option>
                <option value="MySQL">MySQL</option>
                <option value="PostgreSQL">PostgreSQL</option>
                <option value="SQLServer">SQLServer</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="host" className="control-label">Host</label>
              <input type="text" id="host" value={state.host} className="form-control" onChange={(event) => handleChange(event)} />
            </div>
            <div className="form-group">
              <label htmlFor="port" className="control-label">Port</label>
              <input type="text" id="port" value={state.port} className="form-control" onChange={(event) => handleChange(event)} />
            </div>
            <div className="form-group">
              <label htmlFor="database" className="control-label">Database</label>
              <input type="text" id="database" value={state.database} className="form-control" onChange={(event) => handleChange(event)} />
            </div>
            <div className="form-group">
              <label htmlFor="user" className="control-label">User</label>
              <input type="text" id="user" value={state.user} className="form-control" onChange={(event) => handleChange(event)} />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="control-label">Password</label>
              <input type="text" id="password" value={state.password} className="form-control" onChange={(event) => handleChange(event)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" onClick={() => cancel()}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={() => save()}>Save</button>
          </div>
        </div>

      </div>
    </div>
  );
}));

export default ConnectionModal;
