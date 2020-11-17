import React, { Component } from "react";
import { observer } from "mobx-react";

import TutorWaitlist from "../components/table-dashboard-waitlist";
import HeaderMenu from "../components/menu-header.js";

import Container from "@material-ui/core/Container";

///
/// This is the page that will serve as "home" for the currently logged user.
///
/// PROPS
///     @model: MainModel which holds every other model.
///
export default observer(
  class Dashboard extends Component {
    headerLinks = () => {
      let headerArray = [];
      
      const canLists = this.props.model.getCanLists();

      headerArray.push(
        { 
          visible: canLists,
          label: "Display List",
          url: "/selectdisplay"
        }
      );
      
      return headerArray;
    }

    render() {
      const canDashboard = this.props.model.getCanDashboard();
      const links = this.headerLinks();

      return (
        <Container>
          <HeaderMenu drawer={true}
            title="Dashboard" 
            page="Waiting List" 
            menu={links}
            model={this.props.model.menuModel} />

          <div className="page">
            {canDashboard && <TutorWaitlist model={this.props.model} />}
          </div>
        </Container>
      );
    }
  }
);
