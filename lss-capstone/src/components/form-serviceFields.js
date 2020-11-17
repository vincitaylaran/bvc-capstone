import React, { Component } from "react";
import ".././styles/form-addService.css";

import { ColourSelection } from "./form-colourSelection.js";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";

// import { toast } from "react-toastify";
// import { Col } from "react-bootstrap";

export class ServiceFields extends Component {
  render() {
    return (
      <div className="base-container">
        <div className="input-div">
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="component-outlined">Service name</InputLabel>
            <OutlinedInput
              id="component-outlined service-name"
              label="Service name"
              inputRef=""
            />
          </FormControl>
        </div>

        <div className="input-div">
          <TextField
            label="Custom URL"
            id="outlined-start-adornment"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">/</InputAdornment>
              )
            }}
            variant="outlined"
            inputRef=""
          />
        </div>
        <div className="input-div">
          <ColourSelection onSelect="" />
        </div>

        <div className="input-div">
          {/* Select tutors from Users list. Checkboxes, I suppose. */}
        </div>

        <Button
          onClick=""
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          Save service
        </Button>
      </div>
    );
  }
}
