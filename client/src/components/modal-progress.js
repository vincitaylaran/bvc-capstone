import React, { Component } from 'react';
import { observer } from 'mobx-react';

// import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import "../styles/modal.css";

///
/// ModalProgess - 
/// - Props
///     model - ModelMain
export default observer(
  class ModalAlert extends Component{
    render() {
      const openState = this.props.model.getOpenState();
      
      return (
        <div className={openState ? "progress-open" : "progress-close"}>
          <CircularProgress />
        </div>
      )
    }
  }
);