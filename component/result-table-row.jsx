import React from 'react';

import ResultTableCell from './result-table-cell.jsx';

export default class ResultTableRow extends React.PureComponent {
  render() {
    var cells = this.props.row.map((value, index) => <ResultTableCell key={index} value={value} />);
    return <tr><td>{this.props.index + 1}</td>{cells}</tr>;
  }
}
