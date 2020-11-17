import React, { Component } from "react";

import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

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

class SchedulerWeekGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleClick = async e => {
    if (this.props.onOpenTutorPanel) {
      //
      // Stores the 'value' attribute of button that was clicked.
      const btnValue = e.currentTarget.value;
      const btnValueArray = btnValue.split("-"); // OUTPUT FORMAT: [MMMM-DD-dd]
      const month = btnValueArray[0];
      const date = btnValueArray[1];
      const day = btnValueArray[2];

      //
      // If the clicked button is a day of the current week return true. The value
      // of this variable will determine whether to add it to the tutor's appointment schedule
      // for the current or following week.
      const isCurrentWeek =
        e.currentTarget.id === "day-current-week" ? true : false;

      this.props.onOpenTutorPanel(day, date, month, isCurrentWeek);
    }
  };

  render() {
    const { classes } = this.props;

    const currentWeek = this.props.currentWeek();
    const nextWeek = this.props.nextWeek();

    return (
      <>
        {currentWeek.map((availability, index) => {
          return (
            <Grid item xs={3} key={index}>
              <Paper>
                <Button
                  className={classes.button}
                  id="day-current-week"
                  value={`${availability.month}-${availability.date}-${availability.day}`}
                  onClick={this.handleClick}
                >
                  {availability.day}
                  <br />
                  {availability.date}
                </Button>
              </Paper>
            </Grid>
          );
        })}
        {nextWeek.map((availability, index) => {
          return (
            <Grid item xs={3} key={index}>
              <Paper>
                <Button
                  className={classes.button}
                  id="day-next-week"
                  onClick={this.handleClick}
                  value={`${availability.month}-${availability.date}-${availability.day}`}
                >
                  {availability.day}
                  <br />
                  {availability.date}
                </Button>
              </Paper>
            </Grid>
          );
        })}
      </>
    );
  }
}

SchedulerWeekGrid.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SchedulerWeekGrid);
