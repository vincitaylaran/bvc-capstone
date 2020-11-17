import React, { Component } from "react";
import { observer } from "mobx-react";

import DisplayRow from "./WaitlistTableRowForCarousel";

import TableBody from "@material-ui/core/TableBody";

/** PROPS
 * @list: an array of objects
 */
export default observer(
class DisplayTable extends Component {
  render() {
    const list = [];
    list[0] = this.props.model;
    return (

          <TableBody>
          {
            list.map((el, i) => {
              return <DisplayRow key={i} model={el} />
            })
          }
          </TableBody>
    );
  }
});
