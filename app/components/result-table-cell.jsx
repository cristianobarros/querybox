import React from 'react';

import { Cell } from 'fixed-data-table';

const ResultTableCell = React.memo(({ value }) => {
	if (value == null) {
		return <Cell><div className="cell"><div className="cell-overflow-null"><span className="label label-default">NULL</span></div></div></Cell>;
	}
	return <Cell><div className="cell"><div className="cell-overflow">{value}</div></div></Cell>;
});

export default ResultTableCell;
