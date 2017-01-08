import React from 'react';

export default class QueryInfo extends React.Component {
   render() {
      return (
         <div>{ this.props.length } rows in { this.props.time } ms</div>
      );
   }
}