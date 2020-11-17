import React, { Component } from "react";
import { observer } from "mobx-react";

/// DisplayRow
export default observer(
  class DisplayRow extends Component {
    render() {
      const name = this.props.model.getName();
      const queue = this.props.model.getQueue();
      const status = this.props.model.getStatus();

      return (
        <div>
          Name: {name} | Queue: {queue} | Status: {status}
        </div>
      );
    }
  }
);
