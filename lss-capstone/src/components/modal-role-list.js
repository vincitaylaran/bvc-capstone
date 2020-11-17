import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';

import "../styles/modal.css";
import "../styles/rows-list.css";

///
/// ModelRolesList - Lists of Privileges/Services for the role
/// - Props
///     title - title of modal.
///     list - Array of list displayed.
///     open - open state.
///     close - closebutton handler.
export default observer(
  class ModalRoleList extends Component{
    closePopup = () => {
      if (this.props.close) {
        this.props.close();
      }
    }
   
    render() {
      const open = this.props.open;
      const title = this.props.title;
      const list = this.props.list;
      
      return (
        <Dialog onClose={this.closePopup} aria-labelledby="customized-dialog-title" 
          open={open}>
          <MuiDialogTitle disableTypography className="dialog-title">
            <Typography variant="h6">{title}</Typography>
            <IconButton aria-label="close" className="dialog-closeIcon" onClick={this.closePopup}>
            <CloseIcon />
            </IconButton>
          </MuiDialogTitle>
          <MuiDialogContent dividers>
            <div className="rows-list-table">
              <div className="rows-list-rows">
                { list.length > 0
                  ? list.map((li, i) => {
                      return <div key={i} className="rows-list-row">{li}</div>
                    })
                  : <div>No records...</div>
                }
                
              </div>
            </div>
          </MuiDialogContent>
          <MuiDialogActions>
                <Button autoFocus variant="outlined" onClick={this.closePopup} 
                  color="primary">Close</Button>
          </MuiDialogActions>
        </Dialog>
      )
    }
  }
);