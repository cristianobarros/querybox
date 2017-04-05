import React, {PureComponent} from 'react';

import ResultTableCell from './result-table-cell.jsx';
import {Table, Column, Cell} from 'fixed-data-table';
import {ResizeSensor} from 'css-element-queries';

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
          width={this.state.columnWidths[index]}
          isResizable={true}
          allowCellsRecycling={true}
        />
      ))
    )
  }

  onColumnResizeEndCallback(newColumnWidth, columnKey) {
    let widths = this.state.columnWidths.slice();
    widths[columnKey] = newColumnWidth;
    this.setState({
      columnWidths: widths
    });
  }

  getDefaultWidths() {
    const result = this.props.result;
    return result ? result.fields.map((field, index) => 200) : [];
  }

}
