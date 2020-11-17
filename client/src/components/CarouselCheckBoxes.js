import React, { Component } from "react";
import { observer } from "mobx-react";

import LoadingComponent from "../components/component-loading.js";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import AutorenewIcon from "@material-ui/icons/Autorenew";

import ".././styles/caroucel.css";

export default observer(
  class FormCheckbox extends Component {
    constructor(props) {
      super(props);
      this.state = { loading: true };
    }

    async componentDidMount() {
      await this.props.model.displayModel.reset();
      await this.props.model.displayModel.getDisplayServices();
      await this.setState({ loading: false });
    }

    handleChange = (e) => {
      this.props.model.displayModel.checkboxStateChanger(e.target.value, e.target.checked);
    };

    checkBoxes = () => {
      let courses = this.props.model.displayModel.getCoursesforCheckbox();
      
      return courses.map((e, i) => {
        return <FormControlLabel key={i}
            className="box"
            control={
              <Checkbox
                checked={e.state}
                value={e.sid}
                onChange={this.handleChange}
                color="primary"
              />
            }
            label={e.desc}
          />
      })
    };

    render() {
      return (
        this.state.loading
          ? <LoadingComponent text="Loading Services" />
          :
            <div>
              <div className="container-box">
                {this.checkBoxes()}
              </div>
              <Button
                className="button"
                onClick={this.props.onClick}
                variant="contained"
                color="primary"
                startIcon={<AutorenewIcon />} >
                Display
              </Button>
            </div>
      );
    }
  }
);
