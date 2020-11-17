import React, { Component } from "react";
import { observer } from "mobx-react";

import ServiceForm from "../components/form-service.js";
import HeaderMenu from "../components/menu-header.js";
import LoadingComponent from "../components/component-loading.js";

import Container from "@material-ui/core/Container";

///
/// This is the page that will set the fields that will appear when booking.
///
/// Props:
///     model: MainModel which holds every other model.
///
export default observer(
  class ServicePage extends Component {
    constructor(props) {
      super(props);
      this.state = { loading: true };
    }

    async componentDidMount() {
      const { sid } = await this.props.match.params;
      await this.props.model.serviceModel.getServiceData(sid);
      this.setState({loading: false});
    }

    headerLinks = () => {
      let headerArray = [];

      const canServices = this.props.model.getCanServices();
      const code = this.props.model.serviceModel.getSid();
      const fieldsurl = "/servicefields/" + code;

      headerArray.push({
        visible: canServices,
        label: "Manage Fields",
        url: fieldsurl
      });

      headerArray.push({
        visible: canServices,
        label: "List of Services",
        url: "/services"
      });

      return headerArray;
    };

    redirect = () => {
      this.props.history.replace("/services");
    }

    render() {
      const { sid } = this.props.match.params;
      const desc = this.props.model.serviceModel.getDesc();
      const links = this.headerLinks();
      const loadingText = `Loading Service ${desc}...`;

      return (
        <Container>
          <HeaderMenu
            drawer={true}
            title="Services"
            page="Update Service"
            menu={links}
            model={this.props.model.menuModel}
          />

          <div className="page">
            { this.state.loading
              ? <LoadingComponent text={loadingText} />
              : <ServiceForm
                  model={this.props.model}
                  modify={sid}
                  success={this.redirect}/>
            }
          </div>
        </Container>
      );
    }
  }
);
