import React, { Component } from "react";
import { observer } from "mobx-react";

import LoginForm from '../components/form-login.js';
import HeaderMenu from "../components/menu-header.js";

import Container from "@material-ui/core/Container";
///
/// This is the page for logging in. Will show up if user doesnt have token..
///
/// PROPS
///     @model: MainModel which holds every other model.
///
export default observer(
    class LoginPage extends Component {
      forgotPassword = () => {
        this.props.history.push("/forgot");
      }

      headerLinks = () => {
        let headerArray = [];
        
        headerArray.push(
          { 
            visible: true,
            label: "Offered Services",
            url: "/offeredservices"
          }
        );

        headerArray.push(
          { 
            visible: true,
            label: "Feedback",
            url: "/feedback"
          }
        );
        
        return headerArray;
      }

      render() {
        const links = this.headerLinks();
        const appName = this.props.model.getAppName();

        return (
          <Container>
            <HeaderMenu drawer={false}
              title={appName}
              page="" 
              menu={links}
              model={this.props.model.menuModel} />
            
            <div className="page">
              <LoginForm model={this.props.model} forgot={this.forgotPassword} />
            </div>
          </Container>
        );
      }
    }
  );
  