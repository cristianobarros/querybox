import React, {PureComponent} from 'react';
import dateFormat from 'dateformat';
import {Cell} from 'fixed-data-table';

export default class ResultTableCell extends PureComponent {

	valueToHTML (value) {
		if (value instanceof Date) {
			return dateFormat(value, 'yyyy-mm-dd HH:MM:ss.l');
		}
		return value;
	};

	render() {

		let value = this.props.rows[this.props.rowIndex][this.props.columnKey];

		if (value == null) {
			return <Cell><span className="label label-default">NULL</span></Cell>;
		}

		return <Cell><div className="cell"><div className="cell-overflow">{this.valueToHTML(value)}</div></div></Cell>;
	}

}
