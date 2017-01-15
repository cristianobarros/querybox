import React from 'react';

import ResultTableRow from './result-table-row.jsx';

export default class ResultTable extends React.PureComponent {
  render() {
		var headers = this.props.result.fields.map((field, index) => <th key={index}>{field.name}</th>);
		var rows = this.props.result.rows.map((row, index) => <ResultTableRow key={index} index={index} row={row} />);
		return (
      <table className="table table-bordered table-striped table-hover">
        <thead><tr><th></th>{headers}</tr></thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}
