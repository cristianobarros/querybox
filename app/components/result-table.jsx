import React, {PureComponent} from 'react';

import ResultTableCell from './result-table-cell.jsx';
import {Table, Column, Cell} from 'fixed-data-table';
import {ResizeSensor} from 'css-element-queries';

import ObjectFormatter from './../object-formatter';

const BORDER = 1;
const MAX_WIDTH = 300;
const MAX_ROWS_TO_FIND_WIDTH = 30;

export default class ResultTable extends PureComponent {

  constructor(props) {
    super(props);
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
    let element = document.getElementById("result");
    let comp = this;
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

    return <div id="result">{table}</div>
  }

  renderTable() {
    return (
      <Table
        headerHeight={40}
        onColumnResizeEndCallback={(newColumnWidth, columnKey) => this.onColumnResizeEndCallback(newColumnWidth, columnKey)}
        rowsCount={this.props.result.rows.length}
        rowHeight={40}
        isColumnResizing={false}
        width={this.state.width}
        height={this.state.height}>
        {this.renderColumns()}
      </Table>
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
            <ResultTableCell value={this.props.result.rows[props.rowIndex][props.columnKey]}></ResultTableCell>
          )}
          width={this.getColumnWidth(index)}
          isResizable={true}
          allowCellsRecycling={true}
        />
      ))
    )
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

    let columnWidth = this.getHeaderWidth(result.fields[index].name);

    for (let i = 0; i < rowsToFindWidth; i++) {
      let value = rows[i][index];
      let width = this.getCellWidth(value);
      columnWidth = Math.max(width, columnWidth);
    }

    return Math.min(columnWidth, MAX_WIDTH) + BORDER;
  }

  getHeaderWidth(value) {
    let element = document.getElementById("header-width");
    element.innerHTML = ObjectFormatter.format(value);
    return element.clientWidth;
  }

  getCellWidth(value) {
    let element = document.getElementById("cell-width");
    element.innerHTML = ObjectFormatter.format(value);
    return element.clientWidth;
  }

}
