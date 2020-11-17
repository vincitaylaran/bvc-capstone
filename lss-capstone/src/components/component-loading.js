import React, { Component } from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from "@material-ui/core/Typography";

const style = {
    marginTop:'20px',
    marginBottom:'20px'
}

/// CustomServiceField - displays the field for a certain service
/// - Props
///     text: text while loading
export default class LoadingComponent extends Component{
  render() {
    return(
      <div style={style}>
          <div>
            <Typography>
              {this.props.text}
            </Typography>
          </div>
          <LinearProgress />
      </div>
    );
  }
}