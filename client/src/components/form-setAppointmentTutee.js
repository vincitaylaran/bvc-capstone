import React, { Component } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  form: {
    padding: theme.spacing(1)
  }
});

class SchedulerTuteeForm extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleName = e => {
    this.props.model.appointmentModel.setTuteeName(e.target.value);
  };

  handleEmail = e => {
    this.props.model.appointmentModel.setTuteeEmail(e.target.value);
  };

  handlePhone = e => {
    this.props.model.appointmentModel.setTuteePhone(e.target.value);
  };

  handleSpecialRequest = e => {
    this.props.model.appointmentModel.setSpecialRequest(e.target.value);
  };

  onSubmit = () => {
    const { appointmentModel } = this.props.model;

    const name = appointmentModel.getTuteeName();
    const email = appointmentModel.getTuteeEmail();
    const phone = appointmentModel.getTuteePhone();
    const specialRequest = appointmentModel.getSpecialRequest();

    if (this.props.onSetAppointment)
      this.props.onSetAppointment(name, email, phone, specialRequest);
  };

  render() {
    const { classes } = this.props;

    return (
      <form>
        <Grid className={classes.form} xs={12}>
          <TextField label="Name" variant="filled" onChange={this.handleName} />
        </Grid>
        <Grid className={classes.form} item xs={12}>
          <TextField
            label="Email"
            variant="filled"
            onChange={this.handleEmail}
          />
        </Grid>
        <Grid className={classes.form} item xs={12}>
          <TextField
            label="Phone"
            variant="filled"
            onChange={this.handlePhone}
          />
        </Grid>
        <Grid className={classes.form} item xs={12}>
          <TextField
            label="Special requests"
            variant="filled"
            multiline
            onChange={this.handleSpecialRequest}
          />
        </Grid>
        <Grid className={classes.form} item xs={3}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={this.onSubmit}
          >
            Submit
          </Button>
        </Grid>
      </form>
    );
  }
}

SchedulerTuteeForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SchedulerTuteeForm);
