import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import BuildIcon from '@material-ui/icons/Build';
import DeleteIcon from '@material-ui/icons/Delete';

import "../styles/custom-field.css";

///
/// CustomServiceField - displays the field for a certain service
/// - Props
///     model - model that is of ModelServiceObject class
///     modify - event handler for modifying fields.
///     remove - event handler for removing a field.
///     index - index number of certain row.
///     check - Event handler for checking/unchecking checkboxes
export default observer(
  class CustomServiceField extends Component{
    requiredClick = (e) => {
      this.props.model.setRequired(e.target.checked);
      this.checkChange();
    }

    enabledClick = (e) => {
      this.props.model.setEnabled(e.target.checked);
      this.checkChange();
    }

    checkChange = () => {
      if (this.props.check) {
        this.props.check(this.props.model);
      }
    }

    modifyField = () => {
      if (this.props.modify) {
        this.props.modify(this.props.model);
      }
    }

    removeField = () => {
      if (this.props.remove) {
        this.props.remove(this.props.model);
      }
    }

    render() {
      const desc = this.props.model.getDesc();
      const required = this.props.model.getRequired();
      const type = this.props.model.getType();
      const len = this.props.model.getLength();
      const enabled = this.props.model.getEnabled();
      const def = this.props.model.getDefault();
      const typeobj = this.props.model.getTypes().find(
        f=> f.value === type );

      return(
        <div className="row basic-row">
          <div>
            <TextField
              label="Field Type"
              size="small"
              InputProps={{readOnly: true}}
              defaultValue={typeobj.label}
              variant="outlined"
            />

            <TextField
              label="Field Display"
              size="small"
              InputProps={{readOnly: true}}
              defaultValue={desc}
              variant="outlined"
            />

            <TextField
              label="Field Length"
              size="small"
              InputProps={{readOnly: true}}
              defaultValue={len}
              variant="outlined"
            />
  
            <div>
              <Checkbox checked={required}
                onChange={this.requiredClick} />
                  Required
            </div>
    
            <div>
              <Checkbox checked={enabled}
                onChange={this.enabledClick} />
                  Enabled
            </div>

            {def 
              ?  null
              : <div>
                  <Button variant="contained" color="primary"
                    onClick={this.modifyField} 
                      startIcon={<BuildIcon />}>Modify</Button>
                </div>
            }

            {def 
              ?  null
              : <div>
                  <Button variant="contained" color="secondary"
                    onClick={this.removeField}
                      startIcon={<DeleteIcon />} >Remove</Button>
                </div>
            }
          </div>
        </div>
      );
    }
  }
);