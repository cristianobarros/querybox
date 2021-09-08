import React from 'react';

const ErrorPanel = React.memo(({ error }) => {
	return <div className="querybox-error-panel">{error.message}</div>;
});

export default ErrorPanel;
