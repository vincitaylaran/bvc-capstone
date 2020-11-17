import React, { Component } from "react";
import { observer } from "mobx-react";

import ResetPasswordForm from "../components/form-reset.js";
import HeaderMenu from "../components/menu-header.js";
import ErrorPage from "./page-error.js";

import Container from "@material-ui/core/Container";

///
/// This is the page for reseting password.
///
/// PROPS
///     @model: MainModel which holds every other model.
///
export default observer(
  class ResetPage extends Component {
    constructor() {
      super();
      this.state = { valid: false};
    }

    async componentDidMount() {
      // Check token validity.
      const { sid } = await this.props.match.params;
      const parts = sid.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(window.atob(parts[1]));
        if ((new Date()).getTime() < Number(payload.iat) + 600000) {
          this.props.model.loginModel.reset();
          this.props.model.loginModel.setUsername(payload.sub);
          this.setState({valid:true});
        }
      }
    }

    goBack = () => {
        this.props.history.replace("/");
    }

    render() {
      const { sid } = this.props.match.params;
      const valid = this.state.valid;
      const appName = this.props.model.getAppName();
      
      return (
        <Container>
            <HeaderMenu drawer={false}
              title={appName}
              page="" 
              model={this.props.model.menuModel} />
            
            <div className="page">
            {
              valid
              ? <ResetPasswordForm model={this.props.model} token={sid} goback={this.goBack} />
              : <ErrorPage model={this.props.model} />
            }
          </div>
        </Container>
      );
    }
  }
);
  