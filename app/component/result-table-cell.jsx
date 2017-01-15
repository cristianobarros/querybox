import React from 'react';
import dateFormat from 'dateformat';

export default class ResultTableCell extends React.PureComponent {

	valueToHTML (value) {
		if (value instanceof Date) {
			return dateFormat(value, 'yyyy-mm-dd HH:MM:ss.l');
		}
		return value;
	};

	render() {
		if (this.props.value == null) {
			return <td><span className="label label-default">NULL</span></td>;
		}
		return <td>{this.valueToHTML(this.props.value)}</td>;
	}

}
