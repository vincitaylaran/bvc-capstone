import React, { Component } from "react";
import { observer } from "mobx-react";

import HeaderMenu from "../components/menu-header.js";
import RowsList from "../components/rows-list-roles.js";
import LoadingComponent from "../components/component-loading.js";

import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import EmailIcon from '@material-ui/icons/Email';

//Add tutor
export default observer(
  class AddUserPage extends Component {
    constructor(props) {
      super(props);

      this.state = { loading: true };
    }

    async componentDidMount() {
      await this.props.model.tutorModel.reset();
      this.setState({loading: false});
    }

    headerLinks = () => {
      let headerArray = [];
      
      const canUsers = this.props.model.getCanUsers();

      headerArray.push(
        { 
          visible: canUsers,
          label: "List of Users",
          url: "/users"
        }
      );
      
      return headerArray;
    }

    emailChange = e => {
      this.props.model.tutorModel.setEmail(e.target.value);
    };

    sendInvite = async (e) => {
      e.preventDefault();
      this.props.model.showProgress();
      // Get frontend root.
      const root = this.props.model.getUrlRoot();
      this.props.model.tutorModel.setUrl(root);

      const selectedRoles = await this.props.model.roleModel.getSelectedRoles();
      const result = await this.props.model.tutorModel.sendInvite(selectedRoles);

      if (result.success) {
        const emailAddress = this.props.model.tutorModel.getEmail();

        this.props.model.hideProgress();
        this.props.model.tutorModel.reset();
        this.props.model.roleModel.setSelectedRoles([]);
        this.props.history.replace("/users");

        if (!result.emailSent) {
          this.props.model.showAlertDialog("Email not sent.", 
          <div>
            There is no email service set. To send email click this link:
            <br/>
            <a href={"mailto:" + emailAddress + 
              "?subject=" + result.emailSubject + 
              "&body=" + result.emailBody}>Send Email Manually</a>
          </div>,
          "OK", null);
        }
      }
      else {
        this.props.model.hideProgress();
        this.props.model.toastResult(result);
      }
      
    }

    render() {
      const email = this.props.model.tutorModel.getEmail();
      const links = this.headerLinks();

      return (
        <Container>
          <HeaderMenu drawer={true}
            title="Users" 
            page="Invite a User" 
            menu={links}
            model={this.props.model.menuModel} />

          <div className="page">
            <form className="basic-form" onSubmit={this.sendInvite}>
              <div>
                <TextField 
                  fullWidth required
                  type="email" 
                  label="Email Address"
                  value={email} 
                  variant="outlined"
                  onChange={this.emailChange} />
              </div>
              {
                this.state.loading
                ? <LoadingComponent text="Loading Roles Table..." />
                : <RowsList label="Assign Roles" roles={[]}
                  model={this.props.model.roleModel} />
              }
              <div>
                <Button fullWidth variant="contained" startIcon={<EmailIcon />}
                  color="primary" type="submit">Send Invitation</Button>  
              </div>
            </form>
          </div>
        </Container>
      );
    }
  }
);
