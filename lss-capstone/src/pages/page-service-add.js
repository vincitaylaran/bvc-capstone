import React, { Component } from "react";
import { observer } from "mobx-react";

import ServiceForm from "../components/form-service.js";
import HeaderMenu from "../components/menu-header.js";

import Container from "@material-ui/core/Container";

///
/// This is the page that will set the fields that will appear when booking.
///
/// Props:
///     model: MainModel which holds every other model.
///
export default observer(
  class AddServicePage extends Component {
    async componentDidMount() {
      await this.props.model.serviceModel.clearModel();
    }

    headerLinks = () => {
      let headerArray = [];
      
      const canServices = this.props.model.getCanServices();

      headerArray.push(
        { 
          visible: canServices,
          label: "List of Services",
          url: "/services"
        }
      );
      
      return headerArray;
    }

    redirect = () => {
      this.props.history.replace("/services");
    }

    render() {
      const links = this.headerLinks();

      return (
        <Container>
          <HeaderMenu drawer={true}
            title="Services" 
            page="Add a Service" 
            menu={links}
            model={this.props.model.menuModel} />

          <div className="page">
            <ServiceForm model={this.props.model}
              success={this.redirect} />
          </div>
        </Container>
      );
    }
  }
);
