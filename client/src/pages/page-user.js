import React, { Component } from "react";
import { observer } from "mobx-react";

import HeaderMenu from "../components/menu-header.js";
import RowsList from "../components/rows-list-roles.js";
import LoadingComponent from "../components/component-loading.js";

import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import EmailIcon from '@material-ui/icons/Email';


///
/// Props:
///     model: MainModel which holds every other model.
///
export default observer(
  class UserPage extends Component {
    constructor(props) {
      super(props);

      this.state = { loading: true };
    }

    async componentDidMount() {
      const {sid} = await this.props.match.params;
      await this.props.model.tutorModel.getUserFromSid(sid);
      //await this.props.model.roleModel.
      this.setState({loading: false});
    }

    headerLinks = () => {
      let headerArray = [];
      
      const canUsers = this.props.model.getCanUsers();
      const {sid} = this.props.match.params;
      const scheduleLink = "/userschedule/" + sid;

      headerArray.push(
        { 
          visible: canUsers,
          label: "Manage Schedule",
          url: scheduleLink
        }
      );

      headerArray.push(
        { 
          visible: canUsers,
          label: "List of Users",
          url: "/users"
        }
      );
      
      return headerArray;
    }

    updateRoles = async(e) => {
      e.preventDefault();
      this.props.model.showProgress();

      const selectedRoles = await this.props.model.roleModel.getSelectedRoles();
      const result = await this.props.model.tutorModel.updateRoles(selectedRoles);

      this.props.model.toastResult(result);
      this.props.model.hideProgress();
    }

    render() {
      const email = this.props.model.tutorModel.getEmail();
      const fname = this.props.model.tutorModel.getFirstName()
      const lname = this.props.model.tutorModel.getLastName()
      const nname = this.props.model.tutorModel.getNickName()
      const roles = this.props.model.tutorModel.getRoles();
      const links = this.headerLinks();
            
      return (
        <Container>
          <HeaderMenu drawer={true}
            title="Users"
            page="User Details"
            menu={links}
            model={this.props.model.menuModel} />

          <div className="page">
            { this.state.loading
            ? <LoadingComponent text="Loading User and Roles Table..." />
            :  <form className="basic-form" onSubmit={this.updateRoles}>
                <div>
                  <TextField 
                    fullWidth readonly
                    type="email" 
                    label="Email Address"
                    value={email} 
                    variant="outlined"
                    onChange={this.emailChange} />
                </div>
                <div>
                  <TextField 
                    fullWidth readonly
                    type="text" 
                    label="Firstname"
                    value={fname} 
                    variant="outlined"
                    onChange={this.emailChange} />
                </div>
                <div>
                  <TextField 
                    fullWidth readonly
                    type="text" 
                    label="Lastname"
                    value={lname} 
                    variant="outlined"
                    onChange={this.emailChange} />
                </div>
                <div>
                  <TextField 
                    fullWidth readonly
                    type="text" 
                    label="Nickname"
                    value={nname} 
                    variant="outlined"
                    onChange={this.emailChange} />
                </div>

                <RowsList label="Assign Roles"  roles={roles}
                  model={this.props.model.roleModel} />
                              
                <div>
                  <Button fullWidth variant="contained" startIcon={<EmailIcon />}
                    color="primary" type="submit">Update Roles</Button>  
                </div>
              </form>
            }
          </div>
        </Container>
      );
    }
  }
);
