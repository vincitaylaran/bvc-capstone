import React, { Component } from "react";

import { observer } from "mobx-react";

import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import SchedulerWeekGrid from "./buttons-setAppointmentDay";
import SchedulerTimeGrid from "./buttons-setAppointmentTime";
import SchedulerTutorGrid from "./buttons-setAppointmentTutor";

import WalkInField from "../components/fields-walkin.js";
import LoadingComponent from "../components/component-loading.js";
import HeaderMenu from "../components/menu-header.js";

import moment from "moment";

const styles = (theme) => ({
  table: { minWidth: 650 },
  root: {
    flexGrow: 1,
    width: "75%",
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

const AppointmentCalendar = observer(
  class AppointmentCalendar extends Component {
    constructor(props) {
      super(props);

      this.state = {
        isOpenDatePanel: true,
        isOpenTutorPanel: false,
        isOpenTimePanel: false,
        isOpenFormPanel: false,
        loading: true
      };
    }

    async componentDidMount() {
      await this.props.model.walkinModel.getServiceData(this.props.serviceSid);
      this.setState({loading: false});
    }

    handleDatePanel = () => {
      if (this.state.isOpenDatePanel) {
        this.setState({ isOpenDatePanel: false });
      } else {
        this.setState({ isOpenDatePanel: true });
      }
    };

    handleTutorPanel = () => {
      if (this.state.isOpenTutorPanel) {
        this.setState({ isOpenTutorPanel: false });
      } else {
        this.setState({ isOpenTutorPanel: true });
      }
    };

    handleTimePanel = () => {
      if (this.state.isOpenTimePanel) {
        this.setState({ isOpenTimePanel: false });
      } else {
        this.setState({ isOpenTimePanel: true });
      }
    };

    handleFormPanel = () => {
      if (this.state.isOpenFormPanel) {
        this.setState({ isOpenFormPanel: false });
      } else {
        this.setState({ isOpenFormPanel: true });
      }
    };

    shouldOpenTimePanel = (firstName, lastName, tutorSid) => {
      const { appointmentModel } = this.props.model;

      if (firstName && lastName) {
        appointmentModel.setTutorFirstName(firstName);
        appointmentModel.setTutorLastName(lastName);
        appointmentModel.setTutorSid(tutorSid);

        this.setState({ isOpenTimePanel: true });
      }
    };

    shouldOpenTutorPanel = async (day, date, month, isCurrentWeek) => {
      const { appointmentModel, userModel } = this.props.model;

      if (day) {
        //
        // Fetch tutors who work on a similar day and matching service.
        const tutorNames = await userModel.fetchServiceTutors(
          this.props.serviceSid,
          day
        );

        appointmentModel.setAvailableTutors(tutorNames);
        appointmentModel.setServiceSid(this.props.serviceSid);
        appointmentModel.setDay(day);
        appointmentModel.setDate(date);
        appointmentModel.setMonth(month);
        appointmentModel.setIsCurrentWeek(isCurrentWeek);

        this.setState({ isOpenTutorPanel: true });
      }
    };

    shouldOpenFormPanel = async (startTime, date) => {
      const { appointmentModel } = this.props.model;

      if (startTime) {
        appointmentModel.setStartTime(startTime);

        this.setState({ isOpenTimePanel: false });
        this.setState({ isOpenFormPanel: true });
      }
    };

    handleFormSubmit = (name, email, phone, specialRequest) => {
      const { appointmentModel, tutorModel } = this.props.model;

      try {
        const startTime = appointmentModel.getStartTime();
        const day = appointmentModel.getDay();
        const month = appointmentModel.getMonth();
        const date = appointmentModel.getDate();
        const isCurrentWeek = appointmentModel.getIsCurrentWeek();
        //
        // Appointment payload for tutor's appointments.
        tutorModel.setAppointment({
          month: month,
          date: date,
          day: day,
          startTime: startTime,
          isCurrentWeek: isCurrentWeek,
          name: name,
          email: email,
          phone: phone,
          specialRequest: specialRequest,
        });

      } catch (e) {
        console.error(`Error -> ${e}, Email: ${email}`);
      }
    };

    onFormSubmit = async (e) => {
      e.preventDefault();

      this.props.model.showProgress();

      const { appointmentModel } = this.props.model;
      const fields = this.props.model.walkinModel.getFields();
      const result = await appointmentModel.setAppointment(fields);
      
      if (result.success) {
        // Clear appointment
      }
      
      this.props.model.toastResult(result);
      this.props.model.hideProgress();
      

      /*
      // Some of these fields may not be enabled, we will get
      //  from backend instead.

      const name = result[0].value;
      const studentId = result[1].value;
      const phoneNumber = result[2].value;
      const email = result[3].value;
      const notes = result[4].value;

      appointmentModel.setTuteeName(name);
      appointmentModel.setTuteeId(studentId);
      appointmentModel.setTuteePhone(phoneNumber);
      appointmentModel.setTuteeEmail(email);
      appointmentModel.setTuteeNotes(notes);
      */
    };

    render() {
      const { classes } = this.props;

      const appName = "Learner Success Services";
      const desc = this.props.model.walkinModel.getDesc();
      const colour = this.props.model.walkinModel.getColour();
      const fieldsarray = this.props.model.walkinModel.getFields();
      console.log("Loading", this.state.loading);

      const fields = fieldsarray.map((f, i) => {
        return (
          <Grid item xs={12} key={i}>
            <WalkInField model={f} key={f.getCode()}></WalkInField>
          </Grid>
        );
      });

      return (
        <>
          <HeaderMenu
            drawer={false}
            title={appName}
            page={desc}
            model={this.props.model.menuModel}
            nameCentered={true}
          />
          <div className="page booking-page" id={colour}>
            {
              this.state.loading
              ? <LoadingComponent text="Loading Appointment page..." />
              :
                <Container className={classes.root}>
                  <ExpansionPanel
                    name="datePanel"
                    onChange={this.handleDatePanel}
                    expanded={this.state.isOpenDatePanel}
                  >
                    {/** EXPANSION PANEL FOR DAY SELECTION */}
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>
                        Select a date
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Grid container spacing={3}>
                        <Container>
                          <Typography variant="h4">
                            {moment().format("MMMM")}
                          </Typography>
                        </Container>

                        <SchedulerWeekGrid
                          model={this.props.model}
                          currentWeek={this.props.model.userModel.getCurrentWeek}
                          nextWeek={this.props.model.userModel.getNextWeek}
                          onOpenTutorPanel={this.shouldOpenTutorPanel}
                        />
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>

                  {/** EXPANSION PANEL FOR TUTOR SELECTION */}
                  <ExpansionPanel
                    name="tutorPanel"
                    expanded={this.state.isOpenTutorPanel}
                    onChange={this.handleTutorPanel}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>
                        Select a tutor
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Grid container spacing={3}>
                        <SchedulerTutorGrid
                          model={this.props.model}
                          tutorNames={
                            this.props.model.appointmentModel.availableTutors
                          }
                          onOpenTimePanel={this.shouldOpenTimePanel}
                        />
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>

                  {/** EXPANSION PANEL FOR TIME SELECTION */}
                  <ExpansionPanel
                    name="timePanel"
                    onChange={this.handleTimePanel}
                    expanded={this.state.isOpenTimePanel}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>
                        Select a time
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Grid container spacing={3}>
                        <SchedulerTimeGrid
                          model={this.props.model}
                          times={
                            this.props.model.appointmentModel.getTimes
                              ? this.props.model.appointmentModel.getTimes
                              : []
                          }
                          onOpenFormPanel={this.shouldOpenFormPanel}
                        />
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>

                  {/** EXPANSION PANEL FOR FILLING FORM */}
                  <ExpansionPanel
                    name="formPanel"
                    onChange={this.handleFormPanel}
                    expanded={this.state.isOpenFormPanel}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel3a-header"
                    >
                      <Typography className={classes.heading}>Fill form</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Grid container spacing={3}>
                        {fields}
                        <form className="booking-form" onSubmit={this.onBook}>
                          <div className="booking-button">
                            <Button
                              fullWidth
                              variant="contained"
                              size="large"
                              color="default"
                              type="submit"
                              onClick={this.onFormSubmit}
                            >
                              Book
                            </Button>
                          </div>
                        </form>
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Container>
            }
          </div>
        </>
      );
    }
  }
);

AppointmentCalendar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppointmentCalendar);
