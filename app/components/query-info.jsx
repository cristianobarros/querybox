import React, {PureComponent} from 'react';

export default class QueryInfo extends PureComponent {
  render() {
    return (
      <div id="info">{ this.props.message }</div>
    );
  }
}
