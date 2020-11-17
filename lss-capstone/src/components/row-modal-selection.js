import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

///
/// RowModalSelection - Modal form to add a new field
/// - Props
///     index   - row index
///     text    - row text
///     remove  - remove event handler
export default observer(
  class RowModalSelection extends Component{
    removeClick = () => {
      if (this.props.remove) {
        this.props.remove(this.props.index);
      }
    }

    render() {
      const text = this.props.text;
           
      return(
        <Grid item xs={12}>
          <Paper className="dialog-paper">
            {text}
            <IconButton aria-label="close" className="dialog-closeIcon" onClick={this.removeClick}>
              <CloseIcon />
            </IconButton>
          </Paper>
        </Grid>
      );
    }
  }
);