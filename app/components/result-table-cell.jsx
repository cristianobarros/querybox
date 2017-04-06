import React, {PureComponent} from 'react';
import {Cell} from 'fixed-data-table';

import ObjectFormatter from './../object-formatter';

export default class ResultTableCell extends PureComponent {

	render() {
		if (this.props.value == null) {
			return <Cell><div className="cell"><div className="cell-overflow-null"><span className="label label-default">NULL</span></div></div></Cell>;
		}
		return <Cell><div className="cell"><div className="cell-overflow">{this.props.value}</div></div></Cell>;
	}

}
