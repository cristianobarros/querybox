import React from 'react';

const QueryInfo = React.memo(({ message }) => {
	return <div id="info">{ message }</div>;
});

export default QueryInfo;
