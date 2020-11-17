import React, { Component } from "react";
import { observer } from "mobx-react";

import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import VpnKeyIcon from '@material-ui/icons/VpnKey';

///
/// Reset Password form.
/// PROPS
///     @model: MainModel which holds every other model.
///     @goback: event handler for clicking back button.
///     @token: reset password token (check if valid).
///   
export default observer(
    class InviteForm extends Component {
      componentDidMount() {
        //
      }

      // Handler for the back to login button.
      goBack = () => {
        if (this.props.goback) {
          this.props.goback();
        }
      }

      // Handler for change password button.
      changePassword = async (e) => {
        e.preventDefault();
        const token = this.props.token;
        const result = await this.props.model.loginModel.registerPassword(token);
        const message = await this.props.model.loginModel.getMessage();
        result.message = message;
        
        this.props.model.toastResult(result);
        if (result.success) {
            this.props.model.loginModel.setConfirm("");
            this.props.model.loginModel.setPassword("");
            this.goBack();
        }
      }

      /// Callback function for password text change.
      passwordChange = (e) => {
        this.props.model.loginModel.setPassword(e.target.value);
      }

      /// Callback function for confirm password text change.
      confirmChange = (e) => {
        this.props.model.loginModel.setConfirm(e.target.value);
      }

      render() {
        const user = this.props.model.loginModel.getUsername();
        const password = this.props.model.loginModel.getPassword();
        const confirm = this.props.model.loginModel.getConfirm();

        return (
          <div className="login-form">
            <Typography variant="h4">
              Register
            </Typography>
            <Typography>
              Please set your password
            </Typography>
            <form onSubmit={this.changePassword}>
              <Typography variant="h5">
                {user}
              </Typography>
              <div>
                <TextField
                  required
                  className="input"
                  type="password"
                  size="small"
                  label="Password"
                  defaultValue={password}
                  onChange={this.passwordChange}
                  variant="filled"
                />
              </div>
              <div>
                <TextField
                  required
                  className="input"
                  type="password"
                  size="small"
                  label="Confirm Password"
                  defaultValue={confirm}
                  onChange={this.confirmChange}
                  variant="filled"
                />
              </div>
              <div>
                <Button variant="contained" color="default" type="submit"
                  startIcon={<VpnKeyIcon />} >Set Password</Button>
              </div>
            </form>

            <button className="link-button" onClick={this.goBack}>Back to Login</button>
          
          </div>
        );
      }
    }
  );
  