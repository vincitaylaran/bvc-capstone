import React, { Component } from "react";
import { observer } from "mobx-react";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

/** PROPS
 * @list: array of objects
 */
export default observer(
class DisplayRow extends Component {
  tableRows = () => {
    const name = this.props.model.name;
    const queue = this.props.model.queue;
    const status = this.props.model.status;

      let row = 
        <TableRow hover>
          <TableCell>{queue}</TableCell>
          <TableCell>{name}</TableCell>
          <TableCell>{status}</TableCell>
        </TableRow>;
      return row;
  };

  render() {

    return (<>{this.tableRows()}</>);
  }
});
