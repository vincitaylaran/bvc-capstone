import React, { Component } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
  table: { minWidth: 650 },
  root: {
    flexGrow: 1,
    width: "100%",
  },
  button: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    width: "100%",
  },
});

/** PROPS
 * @onOpenFormPanel
 */
class SchedulerTimeGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleClick = (e) => {
    if (this.props.onOpenFormPanel) {
      //
      // Stores the 'value' attribute of button that was clicked.
      const btnValue = e.currentTarget.value.split("-");
      const startTime = btnValue[0];
      const date = btnValue[1];

      this.props.onOpenFormPanel(startTime, date);
    }
  };

  render() {
    const { classes } = this.props;
    let tutorTimes = [];

    const date =
      this.props.model.appointmentModel.getMonth() +
      " " +
      this.props.model.appointmentModel.getDate();

    const startOfDay = this.props.model.userModel.getScheduleStartOfDay();
    const endOfDay = this.props.model.userModel.getScheduleEndOfDay();
    const tutorBookings = this.props.model.bookingsModel.getUserBookings();

    const tutorDaySchedule = this.props.times(
      startOfDay,
      endOfDay,
      tutorBookings,
      date
    );

    //
    // If tutor is not available during a selected day, no times will be rendered and a
    // message will indicate that the tutor is not available on a selected day.
    if (tutorDaySchedule) {
      tutorTimes = tutorDaySchedule.map((time, index) => {
        return (
          <Grid item xs={3} key={index}>
            <Paper>
              <Button
                className={classes.button}
                onClick={this.handleClick}
                value={`${time.startTime}-${time.date}`}
                disabled={time.isAvailable ? false : true}
              >
                {time.startTime}
              </Button>
            </Paper>
          </Grid>
        );
      });
    } else {
      tutorTimes = (
        <Typography variant="h3">Tutor does not work on this day</Typography>
      );
    }

    return <>{tutorTimes}</>;
  }
}
SchedulerTimeGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SchedulerTimeGrid);
