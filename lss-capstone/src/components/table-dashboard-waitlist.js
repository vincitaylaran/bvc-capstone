import React, { Component } from "react";

import WaitlistTableRow from "./table-dashboard-waitlist-row";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import { observer } from "mobx-react";
//import { toJS } from "mobx";

const styles = (theme) => ({
  table: { marginTop: 100 },
  header: { marginBottom: 10 },
});

/** PROPS
 * @list: an array of objects
 */
const TutorWaitlist = observer(
  class TutorWaitlist extends Component {
    constructor(props) {
      super(props);

      this.state = {};
    }

    async componentDidMount() {
      const services = this.props.model.getServices();
      const token = this.props.model.getToken();
      await this.props.model.waitlistModel.getWaitlist(services, token);
    }

    onDelete = async (bookType, bookingId) => {
      await this.props.model.waitlistModel.remove(bookType, bookingId);
    };

    onStatusUpdate = async (bookType, bookingId) => {
      await this.props.model.waitlistModel.updateStatus(bookType, bookingId);
    };

    render() {
      const { classes } = this.props;

      return (
        <>
          <Container>
            <Typography className={classes.header} align="center" variant="h4">
              Appointments
            </Typography>
            <Paper>
              <Table responsive striped hover size="sm">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">Actions</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Date</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Service</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Name</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Status</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <WaitlistTableRow
                    handleStatusUpdate={this.onStatusUpdate}
                    handleDelete={this.onDelete}
                    bookType="appointment"
                    bookings={
                      this.props.model.waitlistModel.waitlist.appointments
                    }
                  />
                </TableBody>
              </Table>
            </Paper>
          </Container>

          <Container className={classes.table}>
            <Typography className={classes.header} align="center" variant="h4">
              Walk-Ins
            </Typography>
            <Paper>
              <Table responsive striped hover size="sm">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">Actions</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Queue</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Service</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Name</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Status</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <WaitlistTableRow
                    handleStatusUpdate={this.onStatusUpdate}
                    handleDelete={this.onDelete}
                    bookType="walk-in"
                    bookings={this.props.model.waitlistModel.waitlist.walkins}
                  />
                </TableBody>
              </Table>
            </Paper>
          </Container>
        </>
      );
    }
  }
);

TutorWaitlist.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TutorWaitlist);
