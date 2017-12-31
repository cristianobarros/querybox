import React, {PureComponent} from 'react';

export default class ErrorPanel extends PureComponent {

	render() {
		return <div className="querybox-error-panel">{this.props.error.message}</div>;
	}

}
