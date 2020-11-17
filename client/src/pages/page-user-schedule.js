import React, { Component} from "react";
import { observer } from "mobx-react";

import HeaderMenu from "../components/menu-header.js";
import UserSchedule from "../components/form-userschedule.js";


import Container from "@material-ui/core/Container";

/// UserSchedulePage - page for showing user schedule
/// Props:
///   model - MainModel
///
export default observer(
  class UserSchedulePage extends Component {
    headerLinks = () => {
      let headerArray = [];
      
      const canUsers = this.props.model.getCanUsers();
      const { sid } = this.props.match.params;
      const url = "/user/" + sid;

      headerArray.push(
        { 
          visible: canUsers,
          label: "User Details",
          url: url
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

    render() {
      const links = this.headerLinks();
      const { sid } = this.props.match.params;

      return (
        <Container>
          <HeaderMenu drawer={true}
            title="Users" 
            page="Manage Schedule" 
            menu={links}
            model={this.props.model.menuModel} />
            <div className="page">
              <UserSchedule model={this.props.model} sid={sid} />
            </div>
        </Container>
      )
    }
  }
);
