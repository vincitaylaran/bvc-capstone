import React, { Component } from "react";
import { observer } from "mobx-react";

import ForgotPasswordForm from '../components/form-forgot.js';
import HeaderMenu from "../components/menu-header.js";

import Container from "@material-ui/core/Container";

///
/// This is the page for logging in. Will show up if user doesnt have token..
///
/// PROPS
///     @model: MainModel which holds every other model.
///
export default observer(
    class ForgotPage extends Component {
      goBack = () => {
        this.props.history.replace("/");
      }

      render() {
        const appName = this.props.model.getAppName();

        return (
          <Container>
            <HeaderMenu drawer={false}
              title={appName}
              page="" 
              model={this.props.model.menuModel} />

            <div className="page">
              <ForgotPasswordForm model={this.props.model} goback={this.goBack} />
            </div>
          </Container>
        );
      }
    }
  );
  