import React, { Component } from "react";
import { observer } from "mobx-react";

import HeaderMenu from "../components/menu-header.js";

// import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

///
/// Displays Analytics.
///
/// Props:
///     model: MainModel which holds every other model.
///
export default observer(
  class ReportsPage extends Component {
    headerLinks = () => {
      // None now, but there will be links in the future.
      // const canReports = this.props.model.getCanReports();
      
      return null;
    }

    render() {
      const links = this.headerLinks();

      return (
        <Container>
          <HeaderMenu drawer={true}
            title="Analytics" 
            page="Reports" 
            menu={links}
            model={this.props.model.menuModel} />

          <div className="page">
            Not yet implemented
          </div>
        </Container>
      );
    }
  }
);
