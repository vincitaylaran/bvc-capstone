import React, { Component } from "react";
import { observer } from "mobx-react";

import HeaderMenu from "../components/menu-header.js";
import FormCheckbox from "../components/CarouselCheckBoxes";

import Container from "@material-ui/core/Container";

export default observer(
  class PreCarousel extends Component {

    headerLinks = () => {
      let headerArray = [];
      const canDashboard = this.props.model.getCanDashboard()
      headerArray.push(
        { 
          visible: canDashboard,
          label: "Waiting List",
          url: "/"
        }
      );
      
      return headerArray;
    }

  moveToCarousel = async () => {
    const sids = await this.props.model.displayModel.getSelectedSids();
    if (sids.length === 0) {
      this.props.history.push("/selectdisplay");
      this.props.model.toastError("No service selected.");
    }
    else {
      this.props.history.push("/rotatedisplay");
    }
  }

  render() {
    const links = this.headerLinks();
    
    return (
      <Container>
        <HeaderMenu drawer={true}
          title="Dashboard" 
          page="Select Waitlist Services" 
          menu={links}
          model={this.props.model.menuModel} />

        <div className="page">
          <FormCheckbox onClick={this.moveToCarousel} model={this.props.model} />
        </div>
      </Container>
    );
  }
});
