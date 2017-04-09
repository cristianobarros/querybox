
import {clipboard} from 'electron';

import React, {PureComponent} from 'react';

import ResultTableCell from './result-table-cell.jsx';
import {Table, Column, Cell} from 'fixed-data-table';
import {ResizeSensor} from 'css-element-queries';
import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";

import ObjectFormatter from './../object-formatter';

import TextMeasurer from './../util/text-measurer';

import uuid from 'uuid/v4';

const BORDER = 1;
const PADDING = 16;
const MAX_WIDTH = 300;
const MAX_ROWS_TO_FIND_WIDTH = 30;

const HEADER_FONT = "bold 14px 'Helvetica Neue',Helvetica,Arial,sans-serif";
const CELL_FONT = "14px 'Helvetica Neue',Helvetica,Arial,sans-serif";

export default class ResultTable extends PureComponent {

  constructor(props) {
    super(props);
    this.uuid = uuid();
    this.state = {
      width : 0,
      height : 0,
      columnWidths : this.getDefaultWidths()
    }
  }

  resetColumnsWidths() {
    this.setState({
      columnWidths: this.getDefaultWidths()
    });
  }

  componentDidMount() {
    let comp = this;
    let element = this.refs.result;
    new ResizeSensor(element, function() {
      comp.setState({
        width : element.clientWidth,
        height : element.clientHeight,
      })
    });
  }

  render() {

    let table = null;

    if (this.props.result != null) {
      table = this.renderTable()
    }

    return <div ref="result" className="result">{table}</div>
  }

  renderTable() {
    return (
      <div>
        <Table
          headerHeight={30}
          onColumnResizeEndCallback={(newColumnWidth, columnKey) => this.onColumnResizeEndCallback(newColumnWidth, columnKey)}
          rowsCount={this.props.result.rows.length}
          rowHeight={30}
          isColumnResizing={false}
          width={this.state.width}
          height={this.state.height}>
          {this.renderColumns()}
        </Table>
        <ContextMenu id={this.id}>
            <MenuItem onClick={this.copy}>Copy</MenuItem>
        </ContextMenu>
      </div>
    );
  }

  renderColumns() {
    return (
      this.props.result.fields.map((field, index) => (
        <Column
          key={index}
          columnKey={index}
          header={<ResultTableCell value={field.name}></ResultTableCell>}
          cell={props => (
            <ContextMenuTrigger
                id={this.id}
                collect={this.collect}
                text={ObjectFormatter.format(this.props.result.rows[props.rowIndex][props.columnKey])}>
                <ResultTableCell value={ObjectFormatter.format(this.props.result.rows[props.rowIndex][props.columnKey])}></ResultTableCell>
            </ContextMenuTrigger>
          )}
          width={this.getColumnWidth(index)}
          isResizable={true}
          allowCellsRecycling={true}
        />
      ))
    )
  }

  collect(props) {
    return {
       text : props.text
    };
  }

  copy(e, data, target) {
    clipboard.writeText(String(data.text));
  }

  getColumnWidth(index) {
    if (index < this.state.columnWidths.length) {
      return this.state.columnWidths[index]
    }
    return 0;
  }

  onColumnResizeEndCallback(newColumnWidth, columnKey) {
    let widths = this.state.columnWidths.slice();
    widths[columnKey] = newColumnWidth;
    this.setState({
      columnWidths: widths
    });
  }

  getDefaultWidths() {
    const comp = this;
    const result = this.props.result;
    return result ? result.fields.map(function(field, index) {
      return comp.resolveCellWidth(comp.props.result, index);
    }) : [];
  }

  resolveCellWidth(result, index) {

    const rows = result.rows;
    const rowsToFindWidth = Math.min(rows.length, MAX_ROWS_TO_FIND_WIDTH);

    let columnWidth = this.getTextWidth(result.fields[index].name, HEADER_FONT);

    for (let i = 0; i < rowsToFindWidth; i++) {
      let value = rows[i][index];
      let width = this.getTextWidth(value, CELL_FONT);
      columnWidth = Math.max(width, columnWidth);
    }

    return Math.min(columnWidth, MAX_WIDTH);
  }

  getTextWidth(value, font) {
    const text = ObjectFormatter.format(value);
    return TextMeasurer.getTextWidth(text, font) + PADDING + BORDER;
  }

}
