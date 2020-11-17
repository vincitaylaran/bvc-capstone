import React, { Component } from "react";
import { observer } from "mobx-react";

//date/time picker
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker} 
  from "@material-ui/pickers";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
  
///
/// CustomServiceField - displays the field for a certain service
/// - Props
///     model - model that is of ModelServiceObject class

export default observer(
  class WalkInField extends Component {
    textChange = (e) => {
      const length = this.props.model.getLength();
      
      if (length > 0) {
        this.props.model.setValue(e.target.value.substring(0, length));
      }
      else {
        this.props.model.setValue(e.target.value);
      }
    }

    dateChange = (date) => {
      this.props.model.setValue(date);
    }

    selectionChange = (e) => {
      this.props.model.setValue(e.target.value);
    }

    checkChange = (e) => {
      this.props.model.setValue(e.target.checked);
    }

    createField = () => {
      const desc = this.props.model.getDesc();
      const enabled = this.props.model.getEnabled();
      const type = this.props.model.getType();
      const value = this.props.model.getValue();
      const required = this.props.model.getRequired();
      
      // type text
      if (type === "text" && enabled) {
        return (
            <div className="booking-input">
              { required 
                ? <TextField required fullWidth type="text" label={desc}
                  value={value} onChange={this.textChange} />
                : <TextField fullWidth type="text" label={desc}
                  value={value} onChange={this.textChange} />
              }
              
            </div>
        );
      }

      else if (type === "number" && enabled) {
        return (
          <div className="booking-input">
            { required
              ? <TextField required fullWidth type="number" label={desc}
                value={value} onChange={this.textChange} />
              : <TextField fullWidth type="number" label={desc}
                value={value} onChange={this.textChange} />
            }
            
          </div>
        );
      }

      else if (type === "phone" && enabled) {
        return (
          <div className="booking-input">
            {
              required
              ? <TextField required fullWidth type="tel" label={desc}
                value={value} onChange={this.textChange} />
              : <TextField fullWidth type="tel" label={desc}
                value={value} onChange={this.textChange} />
            }
            
          </div>
        );
      }

      else if (type === "email" && enabled) {
        return (
          <div className="booking-input">
            {
              required
              ? <TextField required fullWidth type="email" label={desc}
                value={value} onChange={this.textChange}  />
              : <TextField fullWidth type="email" label={desc}
                value={value} onChange={this.textChange}  />
            }
          </div>
        );
      }

      else if (type === "multitext" && enabled) {
        return (
          <div className="booking-input">
            {
              required
              ? <TextField required multiline fullWidth rows="2" label={desc}
                value={value} onChange={this.textChange}  />
              : <TextField multiline fullWidth rows="2" label={desc}
                value={value} onChange={this.textChange}  />
            }
          </div>
        );
      }

      else if (type === "checkbox" && enabled) {
        return (
          <div className="booking-input">
              <FormControlLabel control={<Checkbox color="primary"
                checked={value} onChange={this.checkChange} />}
                label={desc} labelPlacement="start" />
          </div>
        );
      }

      else if (type === "date" && enabled) {
        return (
          <div className="booking-input">
            {
              required
              ? <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker required
                    fullWidth format="MM/dd/yyyy" margin="normal"
                    label={desc} labelPlacement="start"
                    value={value} onChange={this.dateChange}
                    KeyboardButtonProps={{"aria-label": "change date"}}
                  />
                </MuiPickersUtilsProvider>
              : <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    fullWidth format="MM/dd/yyyy" margin="normal"
                    label={desc} labelPlacement="start"
                    value={value} onChange={this.dateChange}
                    KeyboardButtonProps={{"aria-label": "change date"}} />
                </MuiPickersUtilsProvider>
            }
          </div>
        );
      }

      else if (type === "time" && enabled) {
        return (
          <div className="booking-input">
            {
              required
              ? <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardTimePicker required
                    fullWidth margin="normal" label={desc}
                    value={value} onChange={this.dateChange}
                    KeyboardButtonProps={{"aria-label": "change time"}} />
                </MuiPickersUtilsProvider>
              : <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker
                  fullWidth margin="normal" label={desc}
                  value={value} onChange={this.dateChange}
                  KeyboardButtonProps={{"aria-label": "change time"}} />
                </MuiPickersUtilsProvider>
            }
          </div>
        );
      }

      else if (type === "selection" && enabled) {
        const selections = this.props.model.getSelections();
        return (
          <div className="booking-input">
            {
              required
              ? <TextField
                  select fullWidth required
                  label={desc}
                  value={value}
                  onChange={this.selectionChange} >
                  {
                    selections.map((t,i) => {
                      return <MenuItem key={i} value={t}>{t}</MenuItem>
                    })
                  }
                </TextField>
              : <TextField
                  select fullWidth
                  label={desc}
                  value={value}
                  onChange={this.selectionChange} >
                  {
                    selections.map((t,i) => {
                      return <MenuItem key={i} value={t}>{t}</MenuItem>
                    })
                  }
                </TextField>
          }
          </div>
        );
      }

      else return null;
    };

    render() {
      return (
          this.createField()
      );
    }
  }
);
