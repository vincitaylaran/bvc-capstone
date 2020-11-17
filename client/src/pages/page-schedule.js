import React, { Component } from "react";
import { observer } from "mobx-react";

import HeaderMenu from "../components/menu-header.js";
import UserSchedule from "../components/form-userschedule.js";

import Container from "@material-ui/core/Container";

/// UserSchedulePage - page for showing user schedule
/// Props:
///   model - MainModel
///
export default observer(
  class MySchedulePage extends Component {
    headerLinks = () => {
      let headerArray = [];
      
      const canDashboard = this.props.model.getCanDashboard();

      headerArray.push(
        { 
          visible: canDashboard,
          label: "My Account",
          url: "/profile"
        }
      );
     
      return headerArray;
    }

    render() {
      const links = this.headerLinks();
      const sid = this.props.model.getSid();

      return (
        <Container>
          <HeaderMenu drawer={true}
            title="Profile" 
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
