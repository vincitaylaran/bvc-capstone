import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import "../styles/modal.css";

///
/// ModalAlert - Modal form show alert/confirm
/// - Props
///     model - ModelMain
export default observer(
  class ModalAlert extends Component{
    cancelClick = () => {
        this.props.model.alertModel.reset();
    }

    render() {
      const openState = this.props.model.alertModel.getOpenState();
      const title = this.props.model.alertModel.getTitle();
      const message = this.props.model.alertModel.getMessage();
      const okCaption = this.props.model.alertModel.getOkCaption();
      const cancelCaption = this.props.model.alertModel.getCancelCaption();
      const okHandler = this.props.model.alertModel.getOkHandler();
      const isConfirm = this.props.model.alertModel.getIsConfirmDialog();
      
      return (
        <Dialog aria-labelledby="customized-dialog-title" open={openState}>
          <MuiDialogTitle disableTypography className="dialog-title">
            <Typography variant="h6">{title}</Typography>
          </MuiDialogTitle>
          <MuiDialogContent dividers>
            <Typography gutterBottom>{ message }</Typography>
          </MuiDialogContent>
          <MuiDialogActions>
            <Button autoFocus variant="outlined" onClick={okHandler} color="primary">
              {okCaption}
            </Button>
            {
              isConfirm
              ? <Button autoFocus variant="outlined" onClick={this.cancelClick} color="primary">
                    {cancelCaption}
                </Button>
              : null
            }
          </MuiDialogActions>
        </Dialog>
      )
    }
  }
);