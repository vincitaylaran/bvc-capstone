import React, { Component } from "react";
import { observer } from "mobx-react";

import { ColourSelection } from "./form-colourSelection.js";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";

import ".././styles/form-addService.css";

///
/// Props:
///   @model: MainModel which holds every other model.
///   @serviceName: Name of service to appear in "Service name" input box.
///   @url: The custom URL of a service to be modified. Appears in "URL" input box.
///   @modify: Only include if the component should modify existing services. Otherwise, don't include.
///   @success: event on success
export default observer(
  class Service extends Component {
    onSuccess = () => {
      if (this.props.success) {
        this.props.success();
      }
    }
    
    /// Makes a call to model-service.js
    saveService = async (e) => {
      e.preventDefault();

      this.props.model.showProgress();
      let reply;
      if (this.props.modify) {
        reply = await this.props.model.serviceModel.updateService(this.props.modify);
        this.props.model.toastResult(reply);
      }
      // If inputs are valid, save the information.
      else {
        reply = await this.props.model.serviceModel.saveServiceData();
        this.props.model.toastResult(reply);
      }

      this.props.model.hideProgress();
      if (reply.success) {
        await this.props.model.serviceModel.clearModel();
        this.onSuccess();
      }
    };

    /// Save the colour in ModelService.
    /// Props:
    ///   @colour: Colour that will be saved.
    saveColour = (colour) => {
      this.props.model.serviceModel.setColour(colour);
    };

    saveBookingType = (e) => {
      let bookType = this.props.model.serviceModel.getBookingType();
      
      if (e.target.checked) {
        if (!bookType.includes(e.target.value)) {
          bookType.push(e.target.value);
        }        
      }
      else {
        if (bookType.includes(e.target.value)) {
          let index = 0;
          while(index < bookType.length) {
            if (bookType[index] === e.target.value) {
              bookType.splice(index, 1);
            }
            index++;
          }
        }
      }
      this.props.model.serviceModel.setBookingType(bookType);
    };

    /*
    /// For modifying services, retrieve the booking type for checkboxes.
    getBookingType = (value) => {
      let result = this.props.model.serviceModel.getBookingType();
      result = Array.from(result);
      return result.includes(value) ? true : false;
    };
    */

    descChanged = (e) => {
      this.props.model.serviceModel.setDesc(e.target.value);
    }

    sidChanged = (e) => {
      this.props.model.serviceModel.setSid(e.target.value);
    }

    ///
    render() {
      const desc = this.props.model.serviceModel.getDesc();
      const sid = this.props.model.serviceModel.getSid();
      const colour = this.props.model.serviceModel.getColour();
      const bookType = this.props.model.serviceModel.getBookingType();
      
      return (
        <div className="base-container">
          <Typography variant="h5">
            Service info
          </Typography>
          <form onSubmit={this.saveService}>
            <div className="input-div">
              <Tooltip
                title="Only letters, numbers, spaces, apostrophes, underscores, hyphens."
                placement="right"
                arrow>
                <TextField
                  fullWidth
                  type="text"
                  label="Service Name"
                  variant="outlined"
                  value={desc}
                  onChange={this.descChanged} />
              </Tooltip>
            </div>

            <div className="input-div">
              <Tooltip
                title="Only letters, numbers, apostrophes, underscores, hyphens. No spaces."
                placement="right"
                arrow>
                <TextField
                  fullWidth
                  type="text"
                  label="Custom URL"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">/</InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  value={sid}
                  onChange={this.sidChanged}/>
              </Tooltip>
            </div>

            <div className="input-div">
              <ColourSelection onSelect={this.saveColour} props={this.props} defaultValue={colour} />
            </div>

            <Typography variant="h5">
              Service Type
            </Typography>
            <FormControl component="fieldset">
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox value="walk-in" />}
                  label="Walk-in"
                  onChange={this.saveBookingType}
                  checked={bookType.includes("walk-in")}/>
                <FormControlLabel
                  control={<Checkbox value="appointment" />}
                  label="Appointment"
                  onChange={this.saveBookingType}
                  checked={bookType.includes("appointment")}/>
              </FormGroup>
            </FormControl>
            <br />

            <Button type="submit" variant="contained"
              color="primary" startIcon={<SaveIcon />} >
              Save service
            </Button>
          </form>
        </div>
      );
    }
  }
)