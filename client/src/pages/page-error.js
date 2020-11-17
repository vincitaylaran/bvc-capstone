import React, { Component } from "react";
import { observer } from "mobx-react";

import HeaderMenu from "../components/menu-header.js";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Button from '@material-ui/core/Button';

///
/// This is the error page.
///
/// PROPS
///     @model: MainModel which holds every other model.
///
export default observer(
  class ErrorPage extends Component {
    goBack = () => {
      this.props.history.replace("/");
    }

    /// Function for dev purposes only.
    reset = () => {
      localStorage.removeItem("asc_authtoken");
    }

    render() {
      const appName = this.props.model.getAppName();
      const isLogged = this.props.model.isLogged();

      return (
        <Container>
          <HeaderMenu drawer={false}
            title={appName} 
            page="Uh-oh! Error!" 
            model={this.props.model.menuModel} />
          <div className="page">
            <Typography>
              Sorry! You are seeing this error page because of one of the following:
            </Typography>
            <ul>
              <li>
                <Typography>
                  This resource is not accessible to you.
                </Typography>
              </li>
              <li>
                <Typography>
                  This resource is not available.
                </Typography>
              </li>
              <li>
                <Typography>
                  You have the wrong URL.
                </Typography>    
              </li>
              <li>
                <Typography>
                  A supernova occured in one corner of the galaxy, sending
                    particles travelling near the speed of light.
                </Typography>
              </li>
            </ul>
            <Typography>
            If you think that there is a mistake, please drop by N266 and inform us about it.
            </Typography>
            <button className="link-button link-button-blue" onClick={this.goBack}>
              <Typography>Back to Home</Typography>
            </button>
            <br/>
            <br/>
            <br/>
            { isLogged
              ? <Button variant="contained" color="default" 
                  startIcon={<VpnKeyIcon />} onClick={this.reset} >Reset Credentials</Button>
              : null
            }
          </div>
        </Container>
      );
    }
  }
);
