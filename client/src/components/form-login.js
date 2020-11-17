import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import VpnKeyIcon from '@material-ui/icons/VpnKey';

///
/// FormLogin - Login Form with username and password
/// - Props
///     model - model for the whole application
///     forgot - callback function to go go forgot page

export default observer(
  class FormLogin extends Component{
    componentDidMount() {
      this.props.model.loginModel.setMessage("");
    }

    forgot = (e) => {
      e.preventDefault();
      if (this.props.forgot) {
        this.props.forgot();
      }
    }

    /// Callback function for username text change.
    userChange = (e) => {
      this.props.model.loginModel.setUsername(e.target.value);
    }

    /// Callback function for password text change.
    passwordChange = (e) => {
      this.props.model.loginModel.setPassword(e.target.value);
    }

    /// Function for login button click.
    loginClick = async (e) => {
      // Prevent form submit.
      e.preventDefault();
      this.props.model.showProgress();
      
      // Get JWT token from server.
      const result = await this.props.model.loginModel.login();
      if (result.success) {
        // Set credetials based on token.
        if (await this.props.model.setCredentials(result.token)) {
          // Save token to local storage
          const key = this.props.model.loginModel.getTokenKey();    
          localStorage.setItem(key, result.token);
        }
        else {
          this.props.model.toastError("Error logging in.");
        }
      }
      else {
        const message = this.props.model.loginModel.getMessage();
        if (result.severity === 1) {
          this.props.model.toastWarn(message);
        }
        else {
          this.props.model.toastError(message);
        }
      }
      this.props.model.hideProgress();
    }

        ///
    render() {
      const user = this.props.model.loginModel.getUsername();
      const pass = this.props.model.loginModel.getPassword();
      
      return(
        <div className="login-form" >
          
          <Typography variant="h4">
            Login
          </Typography>
          
          <form onSubmit={this.loginClick}>
            <div>
              <TextField
                required
                className="input"
                size="small"
                type="text"
                label="Username"
                value={user}
                onChange={this.userChange}
                variant="filled"
              />
            </div>
            <div>
              <TextField
                required
                className="input"
                size="small"
                type="password"
                label="Password"
                value={pass}
                onChange={this.passwordChange}
                variant="filled"
              />
            </div>
            <div>
              <Button variant="contained" color="default" 
                startIcon={<VpnKeyIcon />} type="submit">Login</Button>
            </div>
              
          </form>
          
          <button className="link-button" onClick={this.forgot}>
            Forgot Password?
          </button>
        </div>
      );
    }
  }
);