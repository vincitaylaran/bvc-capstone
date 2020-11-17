import React, { Component } from "react";

import { observer } from "mobx-react";
// import { toJS } from "mobx";

import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
// import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import HeaderMenu from "../components/menu-header.js";

const styles = theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(2),
    maxWidth: "30%"
  },
  submitBtn: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2)
  }
});

const OfferedServicesPageV2 = observer(
  class OfferedServicesPageV2 extends Component {
    constructor(props) {
      super(props);

      this.state = {};
    }

    headerLinks = () => {
      let headerArray = [];

      headerArray.push({
        visible: true,
        label: "Back to Login",
        url: "/"
      });

      return headerArray;
    };

    async componentDidMount() {
      await this.props.model.serviceModel.setServiceDescriptions();
    }

    onSubmit = () => {
      const { offeredModel } = this.props.model;
      const bookingType = offeredModel.getBookingType();
      const service = this.props.model.offeredModel.getService();
      this.props.history.push(`/${bookingType}/${service}`);
    };

    onSelectedBookingType = e => {
      const value = e.target.value;
      const { offeredModel } = this.props.model;
      offeredModel.setBookingType(value);
    };

    onSelectedService = e => {
      const value = e.target.value;
      const { offeredModel } = this.props.model;
      offeredModel.setService(value);
    };

    render() {
      const { classes } = this.props;
      const appName = "Learner Success Services";
      const links = this.headerLinks();
      const serviceMenuItems = this.props.model.serviceModel
        .getServiceDescriptions()
        .map(item => {
          return <MenuItem value={item.sid}>{item.desc}</MenuItem>;
        });

      return (
        <>
          <Container align="center">
            <HeaderMenu
              drawer={false}
              title={appName}
              page=""
              menu={links}
              model={this.props.model.menuModel}
            />
            <div className="page">
              <Paper className={classes.paper} align="center">
                <Typography variant="h5">Offered Services</Typography>
                <Container>
                  <FormControl className={classes.formControl}>
                    <InputLabel>Booking type</InputLabel>
                    <Select onChange={this.onSelectedBookingType}>
                      <MenuItem value="appointment">Appointment</MenuItem>
                      <MenuItem value="walkinbook">Walk-in</MenuItem>
                    </Select>
                  </FormControl>
                </Container>
                <Container>
                  <FormControl className={classes.formControl}>
                    <InputLabel>Service</InputLabel>
                    <Select onChange={this.onSelectedService}>
                      {serviceMenuItems}
                    </Select>
                  </FormControl>
                </Container>
                <Container className={classes.submitBtn}>
                  <Button onClick={this.onSubmit}>Submit</Button>
                </Container>
              </Paper>
            </div>
          </Container>
        </>
      );
    }
  }
);

OfferedServicesPageV2.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OfferedServicesPageV2);
