import React, { Component } from "react";

import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

// import { toJS } from "mobx";

const styles = theme => ({
  table: { minWidth: 650 },
  root: {
    flexGrow: 1,
    width: "100%"
  },
  button: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    width: "100%"
  }
});

class SchedulerTutorGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleClick = async e => {
    const fullName = e.currentTarget.value.split("-");
    const firstName = fullName[0];
    const lastName = fullName[1];
    const tutorSid = await this.props.model.userModel.getSid(
      firstName,
      lastName
    );

    const serviceSid = this.props.model.appointmentModel.getServiceSid();

    //
    // Sets the buttons for the 'Select a time' panel where the buttons should show the tutor's schedule.
    await this.props.model.userModel.setScheduleStartAndEndOfDay(
      tutorSid,
      serviceSid
    );

    //
    // Make a call to this method. This will help in disabling certain buttons where the tutor has already been booked
    // in the 'Select a time' panel.
    await this.props.model.bookingsModel.setUserBookings(tutorSid, serviceSid);

    this.props.onOpenTimePanel(firstName, lastName, tutorSid);
  };

  render() {
    const { tutorNames, classes } = this.props;

    let tutorBtns = [];

    if (tutorNames.length > 0) {
      tutorBtns = tutorNames.map((name, index) => {
        return (
          <Grid item xs={3}>
            <Paper>
              <Button
                className={classes.button}
                id="tutor-name"
                value={`${name.firstName}-${name.lastName}`}
                onClick={this.handleClick}
              >
                {name.firstName} {name.lastName}
              </Button>
            </Paper>
          </Grid>
        );
      });
    } else {
      tutorBtns = (
        <Typography variant="h4">
          Sorry, there are no tutors working on that day.
        </Typography>
      );
    }

    return <>{tutorBtns}</>;
  }
}

SchedulerTutorGrid.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SchedulerTutorGrid);
