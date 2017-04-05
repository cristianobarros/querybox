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
		if (this.props.value == null) {
			return <Cell><div className="cell"><div className="cell-overflow-null"><span className="label label-default">NULL</span></div></div></Cell>;
		}
		return <Cell><div className="cell"><div className="cell-overflow">{this.valueToHTML(this.props.value)}</div></div></Cell>;
	}

}
