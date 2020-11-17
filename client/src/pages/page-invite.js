import React, { Component } from "react";
import { observer } from "mobx-react";

import HeaderMenu from "../components/menu-header.js";
import InviteForm from "../components/form-invite.js";
import ErrorPage from "./page-error.js";

import Container from "@material-ui/core/Container";

///
/// This is the page for reseting password.
///
/// PROPS
///     @model: MainModel which holds every other model.
///     logout: logout function from the parent.
export default observer(
  class InvitePage extends Component {
    constructor() {
      super();
      this.state = { valid: false};
    }

    async componentDidMount() {
      //Logout user of the System.
      if (this.props.logout) {
        this.props.logout();
      }

      // Check token validity.
      const { sid } = await this.props.match.params;
      const parts = sid.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(window.atob(parts[1]));
        if (payload) {
            if (payload.sub){
                this.props.model.loginModel.setUsername(payload.sub);
                this.setState({valid: true});
            }
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
              ? <InviteForm model={this.props.model} token={sid} goback={this.goBack} />
              : <ErrorPage model={this.props.model} />
            }
          </div>
        </Container>
      );
    }
  }
);
  