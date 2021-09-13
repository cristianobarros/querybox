import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import $ from 'jquery';
import 'bootstrap';
import 'brace/ext/themelist';

import InputHotkey from "./input-hotkey.jsx";

const ConfigurationModal = React.memo(forwardRef((props, ref) => {

  const getThemes = () => {
    const themes = ace.acequire("ace/ext/themelist").themes;
    const result = themes.reduce((result, theme) => {
      result[theme.isDark ? "dark" : "bright"].push(theme);
      return result;
    }, { bright: [], dark: [] });
    result.bright.sort((a, b) => a.caption.localeCompare(b.caption));
    result.dark.sort((a, b) => a.caption.localeCompare(b.caption));
    return result;
  };

  const configurationModal = useRef();

  const [ themes ] = useState(getThemes());
  const [ configuration, setConfiguration ] = useState(props.configuration);
  const [ savedConfiguration, setSavedConfiguration ] = useState();

  useEffect(() => {
    $(configurationModal).modal({
      show: false,
      keyboard: false,
      backdrop: "static"
    });
  }, []);

  const renderThemes = themes => {
    return themes.map((theme, index) => {
      return (<option value={theme.name} key={index}>{theme.caption}</option>);
    });
  };

  const handleChange = event => {

    const key = event.target.id;
    const value = event.target.value;

    const newConfiguration = Object.assign({}, configuration, { [key]: value });

    setConfiguration(newConfiguration);
    props.onChange(newConfiguration);
  };

  const handleKeybindChange = (key, value) => {
    const newConfiguration = $.extend(true, {}, configuration);
    newConfiguration.keybindings[key] = value;
    setConfiguration(newConfiguration);
    props.onChange(newConfiguration);
  };

  const cancel = () => {
    const newConfiguration = $.extend(true, {}, savedConfiguration);
    setConfiguration(newConfiguration);
    props.onChange(newConfiguration);
    $(configurationModal.current).modal('hide');
  };

  const save = () => {
    const data = {
      theme: configuration.theme,
      keybindings: Object.assign({}, configuration.keybindings),
    };
    props.onSave(data);
    $(configurationModal.current).modal('hide');
  };

  useImperativeHandle(ref, () => ({
    show() {
      setSavedConfiguration($.extend(true, {}, props.configuration));
      $(configurationModal.current).modal('show');
    }
  }));

  return (
    <div className="modal fade" role="dialog" ref={configurationModal}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={() => cancel()}>&times;</button>
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
                  <select id="theme" value={configuration.theme} className="form-control" onChange={(event) => handleChange(event)}>
                    <optgroup label="Bright">
                      {renderThemes(themes.bright)}
                    </optgroup>
                    <optgroup label="Dark">
                      {renderThemes(themes.dark)}
                    </optgroup>
                  </select>
                </div>
              </div>
              <div className="tab-pane" id="keybindings">
                <div className="form-group">
                  <label htmlFor="newTab" className="control-label">New tab</label>
                  <InputHotkey id="newTab" className="form-control"
                    value={configuration.keybindings.newTab}
                    onChange={(value) => handleKeybindChange("newTab", value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="closeTab" className="control-label">Close tab</label>
                  <InputHotkey id="closeTab" className="form-control"
                    value={configuration.keybindings.closeTab}
                    onChange={(value) => handleKeybindChange("closeTab", value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="restoreTab" className="control-label">Restore tab</label>
                  <InputHotkey id="restoreTab" className="form-control"
                    value={configuration.keybindings.restoreTab}
                    onChange={(value) => handleKeybindChange("restoreTab", value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="previousTab" className="control-label">Previous tab</label>
                  <InputHotkey id="previousTab" className="form-control"
                    value={configuration.keybindings.previousTab}
                    onChange={(value) => handleKeybindChange("previousTab", value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="nextTab" className="control-label">Next tab</label>
                  <InputHotkey id="nextTab" className="form-control"
                    value={configuration.keybindings.nextTab}
                    onChange={(value) => handleKeybindChange("nextTab", value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="executeQuery" className="control-label">Execute query</label>
                  <InputHotkey id="executeQuery" className="form-control"
                    value={configuration.keybindings.executeQuery}
                    onChange={(value) => handleKeybindChange("executeQuery", value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="formatQuery" className="control-label">Format query</label>
                  <InputHotkey id="formatQuery" className="form-control"
                    value={configuration.keybindings.formatQuery}
                    onChange={(value) => handleKeybindChange("formatQuery", value)} />
                </div>
              </div>
            </div>
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

export default ConfigurationModal;
