import React, { Component } from "react";
import { observer } from "mobx-react";

import HeaderMenu from "../components/menu-header.js";

import Container from "@material-ui/core/Container";
///
/// This is the page that will serve as "home" for the currently logged user.
///
/// PROPS
///     @model: MainModel which holds every other model.
///
export default observer(
  class AdministratonPage extends Component {
    headerLinks = () => {
      let headerArray = [];
      
      const canDashboard = this.props.model.getCanDashboard();

      headerArray.push(
        { 
          visible: canDashboard,
          label: "Set Default Fields",
          url: "/defaultfields"
        }
      );
      
      return headerArray;
    }

    render() {
      const links = this.headerLinks();

      return (
        <Container>
          <HeaderMenu drawer={true}
            title="Admin" 
            page="System Defaults" 
            menu={links}
            model={this.props.model.menuModel} />

          <div className="page">
            Not yet implemented.
          </div>
        </Container>
      );
    }
  }
);
