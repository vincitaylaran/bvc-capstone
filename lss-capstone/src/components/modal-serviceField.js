import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from "@material-ui/core/Tooltip";
import CloseIcon from '@material-ui/icons/Close';
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import SaveIcon from "@material-ui/icons/Save";

import RowModalSelection from "./row-modal-selection.js";
import "../styles/modal.css";

///
/// ModalServiceField - Modal form to add a new field
/// - Props
///     model - ModelServiceObject
///     close - Event handler for closing popup
///     openstate - Declares the state of popup. True if open.
///     new - States if field is a new field
///     create - Event handler for creating new field
export default observer(
  class ModalServiceField extends Component{
    closePopup = () => {
      if (this.props.close) {
        this.props.close();
      }
    }

    create = (e) => {
      e.preventDefault();

      if (this.props.create) {
        this.props.create();
      }
    }

    update = (e) => {
      e.preventDefault();
            
      if (this.props.update) {
        this.props.update();
      }
    }

    removeSelection = (index) => {
      this.props.model.removeSelection(index);
    }

    addSelection = () => {
      this.props.model.addSelection();
    }

    typeChange = (e) => {
      this.props.model.setType(e.target.value);
    }

    codeChange = (e) => {
      this.props.model.setCode(e.target.value);
    }

    descChange = (e) => {
      this.props.model.setDesc(e.target.value);
    }

    requiredChange = (e) => {
      this.props.model.setRequired(e.target.checked);
    }

    lengthChange = (e) => {
      this.props.model.setLength(e.target.value);
    }

    selChange = (e) => {
      this.props.model.setSelection(e.target.value);
    }
        
    render() {
      const open = this.props.openstate;
      const desc = this.props.model.getDesc();
      const type = this.props.model.getType();
      const length = this.props.model.getLength();
      const types = this.props.model.getTypes();
      const sel = this.props.model.getSelection();
      const selections = this.props.model.getSelections()
      
      return (
        <Dialog onClose={this.closePopup} aria-labelledby="customized-dialog-title" 
          open={open}>
          <form onSubmit={this.props.new ? this.create : this.update} >
          <MuiDialogTitle disableTypography className="dialog-title">
            <Typography variant="h6">
              {this.props.new ? "Add New Field" : "Modify Field"}
            </Typography>
            {this.closePopup ? (
              <IconButton aria-label="close" className="dialog-closeIcon" onClick={this.closePopup}>
                <CloseIcon />
              </IconButton>
            ) : null}
          </MuiDialogTitle>
          <MuiDialogContent dividers>
            <div className="dialog-flex">
              <div className="dialog-flex-item">
                <div className="dialog-input-container">
                  <TextField
                    select
                    fullWidth required
                    label="Field Type"
                    defaultValue={type}
                    onChange={this.typeChange}
                    variant="outlined"
                  >
                    {types.map(f => (
                      <MenuItem key={f.value} value={f.value}>
                        {f.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="dialog-input-container">
                  <Tooltip
                    title="Only letters and numbers. The description displayed for the field."
                    placement="right"
                    arrow 
                  >
                    <TextField
                      fullWidth required
                      label="Field Display"
                      defaultValue={desc}
                      onChange={this.descChange}
                      variant="outlined"
                    />
                  </Tooltip>
                </div>
                {
                  ("text,number,email,phone,multitext").includes(type)
                  ? <div className="dialog-input-container">
                      <Tooltip
                        title="Maximum characters of input. Type 0 if not specified."
                        placement="right"
                        arrow 
                      >
                        <TextField
                          fullWidth
                          label="Field Length"
                          type="number"
                          defaultValue={length}
                          onChange={this.lengthChange}
                          variant="outlined"
                        />
                      </Tooltip>
                    </div>
                  : null
                } 
              </div>
              {
                type === "selection"
                ? <div className="dialog-flex-item">
                    <div className="dialog-input-container">
                      <div>
                        <TextField
                          label="Add Selection"
                          defaultValue={sel}
                          onChange={this.selChange}
                          variant="outlined"
                        ></TextField>
                        <Button autoFocus variant="contained" onClick={this.addSelection} color="primary">
                          Add
                        </Button>
                      </div>
                      <Grid container className="dialog-grid-container">
                        {
                          selections.map((t,i) => {
                            return <RowModalSelection key={i} index={i} text={t}
                              remove={this.removeSelection}  />
                          })
                        }
                      </Grid>
                    </div>
                  </div>
                : null
              }
              
            </div>
          </MuiDialogContent>
          <MuiDialogActions>
            {this.props.new
              ? 
                <Button autoFocus variant="outlined" type="submit" 
                  startIcon={<SaveIcon />} color="primary">Create</Button>
              : <Button autoFocus variant="outlined" type="submit"
                  startIcon={<SaveIcon />} color="primary">Update</Button>
            }
          </MuiDialogActions>
          </form>
        </Dialog>
      )
    }
  }
);