import React, { Component } from "react";
import { observer } from "mobx-react";

import HeaderMenu from "../components/menu-header.js";
import Container from "@material-ui/core/Container";

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import SaveIcon from "@material-ui/icons/Save";

///Profile page
export default observer(
  class Profile extends Component {
    componentDidMount() {
      const email = this.props.model.getSub();
      const fname = this.props.model.getFirstname();
      const lname = this.props.model.getLastname();
      const nname = this.props.model.getNickname();

      this.props.model.profile.setEmail(email);
      this.props.model.profile.setFirstname(fname);
      this.props.model.profile.setLastname(lname);
      this.props.model.profile.setNickname(nname);
    }

    headerLinks = () => {
      let headerArray = [];
      
      const canDashboard = this.props.model.getCanDashboard();
      
      headerArray.push(
        { 
          visible: canDashboard,
          label: "Set My Schedule",
          url: "/myschedule"
        }
      );
      
      return headerArray;
    }

    // Function to update profile.
    updateProfile = async (e) => {
      e.preventDefault();
      this.props.model.showProgress();

      // Update profile.
      const result = await this.props.model.profile.updateProfile();

      // When successful, since profile changed, update token.
      if (result.success) {
        // Update token.
        const key = this.props.model.loginModel.getTokenKey();    
        localStorage.setItem(key, result.token);
        this.props.model.setCredentials(result.token);
      }

      // Show result and remove progress bar.
      this.props.model.toastResult(result);
      this.props.model.hideProgress();
      
    }

    // Function to update password.
    updatePassword = async (e) => {
      e.preventDefault();
      this.props.model.showProgress();

      // Update password.
      const result = await this.props.model.profile.updatePassword();

      // If success, remove what the user typed.
      if (result.success) {
        this.props.model.profile.resetPassword();
      }

      // Show result and remove progress bar.
      this.props.model.toastResult(result);
      this.props.model.hideProgress();
    }

    openChangePassword = () => {
      this.props.model.profile.resetPassword();
    }
    
    emailChange = (e) => {
      this.props.model.profile.setEmail(e.target.value);
    }

    firstnameChange = (e) => {
      this.props.model.profile.setFirstname(e.target.value);
    }

    lastnameChange = (e) => {
      this.props.model.profile.setLastname(e.target.value);
    }

    nicknameChange = (e) => {
      this.props.model.profile.setNickname(e.target.value);
    }

    passwordChange = (e) => {
      this.props.model.profile.setPassword(e.target.value);
    }

    newpassChange = (e) => {
      this.props.model.profile.setNewPassword(e.target.value);
    }

    confirmChange = (e) => {
      this.props.model.profile.setConfirmPassword(e.target.value);
    }

    render() {
      const links = this.headerLinks();

      const email = this.props.model.profile.getEmail();
      const fname = this.props.model.profile.getFirstname();
      const lname = this.props.model.profile.getLastname();
      const nname = this.props.model.profile.getNickname();
      
      const pass = this.props.model.profile.getPassword();
      const newpass = this.props.model.profile.getNewPassword();
      const confirmpass = this.props.model.profile.getConfirmPassword();

      return (
        <Container>
          <HeaderMenu drawer={true}
            title="Profile" 
            page="My Account" 
            menu={links}
            model={this.props.model.menuModel} />

          <div className="page">
            <form className="basic-form" onSubmit={this.updateProfile}>
              <div>
                <TextField 
                  fullWidth required
                  type="email" 
                  label="Email Address"
                  value={email} 
                  variant="outlined"
                  onChange={this.emailChange} />
              </div>
              <div>
                <TextField 
                  fullWidth
                  type="text" 
                  label="Firstname"
                  value={fname} 
                  variant="outlined"
                  onChange={this.firstnameChange} />
              </div>
              <div>
                <TextField 
                  fullWidth
                  type="text" 
                  label="Lastname"
                  value={lname} 
                  variant="outlined"
                  onChange={this.lastnameChange} />
              </div>
              <div>
                <TextField 
                  fullWidth
                  type="text" 
                  label="Nickname"
                  value={nname} 
                  variant="outlined"
                  onChange={this.nicknameChange} />
              </div>
              <div>
                <Button fullWidth variant="contained" startIcon={<SaveIcon />}
                  color="primary" type="submit">Update Profile</Button>
              </div>
            </form>

            <ExpansionPanel className="basic-half">
              <ExpansionPanelSummary
                onClick={this.openChangePassword}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content">
                <Typography variant="h6">Change Password</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Divider />
                <form className="basic-form" onSubmit={this.updatePassword}>
                  <div>
                    <TextField 
                      fullWidth required
                      type="password" 
                      label="Current Password"
                      value={pass} 
                      variant="outlined"
                      onChange={this.passwordChange} />
                  </div>
                  <div>
                    <TextField 
                      fullWidth required
                      type="password" 
                      label="New Password"
                      value={newpass} 
                      variant="outlined"
                      onChange={this.newpassChange} />
                  </div>
                  <div>
                    <TextField 
                      fullWidth required
                      type="password" 
                      label="Confirm New Password"
                      value={confirmpass} 
                      variant="outlined"
                      onChange={this.confirmChange} />
                  </div>
                  <div>
                    <Button fullWidth variant="contained" startIcon={<SaveIcon />}
                      color="primary" type="submit">Change Password</Button>
                  </div>
                </form>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        </Container>
      );
    }
  }
);
