import React, { Component } from "react";
import { observer } from "mobx-react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkboxx from "@material-ui/core/Checkbox";
// import Button from "@material-ui/core/Button";
// import AutorenewIcon from "@material-ui/icons/Autorenew";
// import PropTypes from "prop-types";

import ".././styles/caroucel.css";

export default observer(
  class Scheduelcheckbox extends Component {
    constructor(props) {
      super(props);
      this.state = { loading: true };
    }
    handleChange = value => {
      this.props.props.model.userModel.checkboxStateChanger(value);
    };
    async componentDidMount() {
      await this.props.props.model.serviceModel.getServicesData();
      await this.fillCheckboxState();
      await this.setState({ loading: false });
    }
    fillCheckboxState = () => {
      let services = this.props.props.model.serviceModel.gettempServicesList();
      this.props.props.model.userModel.makeCheckboxState(services);
    };

    checkBoxs = () => {
      let courses = this.props.props.model.userModel.getCoursesforCheckbox();
      // create check and uncheked list
      let NumberOfCourses = courses.length;
      let elememnt = [];

      // const { classes } = this.props;

      for (let i = 0; i < NumberOfCourses; i++) {
        elememnt.push(
          <FormControlLabel
            className="box"
            control={
              <Checkboxx
                checked={courses[i].state}
                onChange={() => this.handleChange(courses[i].desc)}
                value={"checkedB" + i}
                color="primary"
              />
            }
            label={courses[i].desc}
          />
        );
      }
      return elememnt;
    };
    ChangeCaroucelScene = () => {
      this.props.props.model.userModel.setScenToCarousel(true);
    };

    render() {
      let render = <div>loading</div>;
      if (!this.state.loading) render = this.checkBoxs();
      // const { classes } = this.props;
      return (
        <div>
          <div className="container-box">{render}</div>
        </div>
      );
    }
  }
);
