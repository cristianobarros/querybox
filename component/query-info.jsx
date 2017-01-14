import React from 'react';

export default class QueryInfo extends React.PureComponent {
  render() {
    return (
      <div id="info">{ this.props.message }</div>
    );
  }
}
