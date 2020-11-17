import React, { Component } from "react";
import { observer } from "mobx-react";

import AddRoleForm from "../components/form-addRole.js";
import HeaderMenu from "../components/menu-header.js";

import Container from "@material-ui/core/Container";

///
/// This is the page that will set the fields that will appear when booking.
///
/// PROPS
///     @model: MainModel which holds every other model.
///
export default observer(
  class UpdateRoles extends Component {
    headerLinks = () => {
      let headerArray = [];
      
      const canRoles = this.props.model.getCanRoles()

      headerArray.push(
        { 
          visible: canRoles,
          label: "List of Roles",
          url: "/roles"
        }
      );
      
      return headerArray;
    }

    render() {
      const links = this.headerLinks();
      const { sid } = this.props.match.params;

      return (
        <Container>
          <HeaderMenu drawer={true}
            title="Roles" 
            page="Update Role"
            menu={links}
            model={this.props.model.menuModel} />

          <div className="page">
            <AddRoleForm model={this.props.model} roleSid={sid}
              onSuccess={this.props.history.replace}
              onSuccessParam="/roles" />
          </div>
        </Container>
      );
    }
  }
);
