import React, { Component } from "react";

//
// Core
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

//
// Icons
import IconButton from "@material-ui/core/IconButton";
import UpdateIcon from "@material-ui/icons/Update";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

//
// Mobx
import { toJS } from "mobx";
import { observer } from "mobx-react";

/** PROPS
 * @list: array of objects
 */

export default observer(
  class WaitlistTableRow extends Component {
    constructor(props) {
      super(props);

      this.state = {};
    }

    onDelete = async (e) => {
      //
      // Get tutee's ID.
      const bookingId = e.currentTarget.value;
      const bookType = this.props.bookType;
      await this.props.handleDelete(bookType, bookingId);
    };

    onUpdateStatus = async (e) => {
      const bookingId = e.currentTarget.value;
      const bookType = this.props.bookType;
      await this.props.handleStatusUpdate(bookType, bookingId);
    };

    render() {
      const row = this.props.bookings.map((booking, index) => (
        <TableRow key={booking._id} hover>
          <TableCell>
            <IconButton value={booking._id} onClick={this.onUpdateStatus}>
              <UpdateIcon />
            </IconButton>
            <IconButton value={booking._id} onClick={this.onDelete}>
              <DeleteForeverIcon />
            </IconButton>
          </TableCell>
          <TableCell>
            {booking.book_type === "walk-in" ? index + 1 : booking.date}
          </TableCell>
          <TableCell>{booking.service_sid}</TableCell>
          <TableCell>
            {booking.fname && booking.lname
              ? booking.fname + " " + booking.lname
              : booking.tutee_name}
          </TableCell>
          <TableCell>
            {booking.status === "ongoing" ? "Ongoing" : "Waiting"}
          </TableCell>
        </TableRow>
      ));

      return <>{row}</>;
    }
  }
);
