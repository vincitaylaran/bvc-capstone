import React, { Component } from "react";
import { observer } from "mobx-react";
import TableCell from "@material-ui/core/TableCell";

import TableRow from "@material-ui/core/TableRow";

export default observer(
  class DisplayOffersRow extends Component {
    tableRows = () => {
      let page = this.props.props.model.offeredModel.getPageNumber();
      let rowperpage = this.props.props.model.offeredModel.getPageRow();
      let offers = this.props.props.model.offeredModel.getOffers();
      let row = [];
      if (offers.length > 0) {
        for (
          let i = (page - 1) * rowperpage;
          i < (page - 1) * rowperpage + rowperpage;
          i++
        ) {
          if (offers[i] === undefined) continue;
          row.push(
            <TableRow>
              <TableCell>{offers[i]}</TableCell>
            </TableRow>
          );
        }
      } else
        row.push(
          <TableRow>
            <TableCell>No Result found</TableCell>
          </TableRow>
        );

      return row;
    };

    render() {
      return <>{this.tableRows()}</>;
    }
  }
);
