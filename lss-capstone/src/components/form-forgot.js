import React, { Component } from "react";
import { observer } from "mobx-react";

import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import VpnKeyIcon from '@material-ui/icons/VpnKey';

///
/// Forgot Password form.
/// PROPS
///     @model: MainModel which holds every other model.
///     @goback: event handler for clicking back button.
///   
export default observer(
    class ForgotPasswordForm extends Component {
      componentDidMount() {
        this.props.model.loginModel.setMessage("");
      }

      goBack = () => {
        if (this.props.goback) {
          this.props.goback();
        }
      }

      sendEmail = async (e) => {
        e.preventDefault();
        const result = await this.props.model.loginModel.resetPassword();
        const message = this.props.model.loginModel.getMessage();
        if (result.success) {
          console.log("Link : This is for demo. Link should not be passed in client.", 
            message);
          this.props.model.toastSuccess("An email will be sent to your account.");
        }
        else {
          if (result.severity === 1) {
            this.props.model.toastWarn(message);
          }
          else {
            this.props.model.toastError(message);
          }
        }
      }

      /// Callback function for username text change.
      userChange = (e) => {
        this.props.model.loginModel.setUsername(e.target.value);
      }

      render() {
        const user = this.props.model.loginModel.getUsername();
        return (
          <div className="login-form">
            <Typography variant="h4">
              Forgot Password?
            </Typography>
            
            <form onSubmit={this.sendEmail}>
              <div>
                <TextField
                  required
                  className="input"
                  type="text"
                  size="small"
                  label="Email/Username"
                  defaultValue={user}
                  onChange={this.userChange}
                  variant="filled"
                />
              </div>
              <div>
                <Button variant="contained" color="default" type="submit"
                  startIcon={<VpnKeyIcon />} >Reset Password</Button>
              </div>
            </form>
          
            <button className="link-button" onClick={this.goBack}>Back to Login</button>
          
          </div>
        );
      }
    }
  );
  