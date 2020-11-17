import React, { Component } from "react";
import { observer } from "mobx-react";
import HeaderMenu from "../components/menu-header.js";
import Container from "@material-ui/core/Container";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: 12,
  },
}));

export default observer(
  class Suggestion extends Component {
    headerLinks = () => {
      let headerArray = [];

      headerArray.push({
        visible: true,
        label: "Back to Login",
        url: "/",
      });

      return headerArray;
    };

    userNameChange = (e) => {
      this.props.model.suggestions.setUserName(e.target.value);
    };

    emailChange = (e) => {
      this.props.model.suggestions.setEmail(e.target.value);
    };

    handleChangeOptions = (e) => {
      this.props.model.suggestions.setOption(e.target.value);
    };

    handleChangeTextArea = (e) => {
      this.props.model.suggestions.setSuggestion(e.target.value);
    };

    onClickSubmit = (e) => {
      e.preventDefault();
      this.props.model.suggestions.saveSuggestions();
    };

    render() {
      const links = this.headerLinks();
      const appName = this.props.model.getAppName();
      const userName = this.props.model.suggestions.getUserName();
      const email = this.props.model.suggestions.getEmail();
      const option = this.props.model.suggestions.getOption();
      const userErrorMessage = this.props.model.suggestions.getUserErrorMessage();
      const emailErrorMessage = this.props.model.suggestions.getEmailErrorMessage();
      const optionErrorMessage = this.props.model.suggestions.getOptionErrorMessage();
      const suggestionErrorMessage = this.props.model.suggestions.getSuggestionErrorMessage();

      return (
        <Container>
          <HeaderMenu
            drawer={false}
            title={appName}
            page=""
            menu={links}
            model={this.props.model.menuModel}
          />

          <div className="suggestions-form">
            <h2>MAKE A COMMENT OR SUGGESTION</h2>
            <div>
              Would you like to comment on our service? Have a comment about our
              website? Let us know!{" "}
            </div>
            <div>
              Send us your comments and suggestion to imporve your service
            </div>
            <FormControl variant="filled">
              <TextField
                id="outlined-multiline-static"
                label="Username"
                variant="outlined"
                value={userName}
                className={useStyles.textField}
                onChange={this.userNameChange}
              />
              <br />

              {userErrorMessage ? (
                <div className="message-warning">{userErrorMessage}</div>
              ) : (
                <div></div>
              )}
              <TextField
                id="outlined-multiline-static"
                label="Email"
                variant="outlined"
                value={email}
                onChange={this.emailChange}
              />
              <br />

              {emailErrorMessage ? (
                <div className="message-warning">{emailErrorMessage}</div>
              ) : (
                <div></div>
              )}
              <div>Choose an option</div>
              <br />

              <Select value={option} onChange={this.handleChangeOptions}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"ELL"}>English Language Learning </MenuItem>
                <MenuItem value={"CTTutor"}>
                  Creative Technology Tutorials
                </MenuItem>
                <MenuItem value={"PNTutor"}>Practical Nursing</MenuItem>
                <MenuItem value={"Reboot"}>Reboot</MenuItem>
              </Select>
              <br />
              {optionErrorMessage ? (
                <div className="message-warning">{optionErrorMessage}</div>
              ) : (
                <div></div>
              )}

              <TextField
                id="outlined-multiline-static"
                label="Feedback"
                multiline
                rows="5"
                variant="outlined"
                onChange={this.handleChangeTextArea}
              />
              <br />

              {suggestionErrorMessage ? (
                <div className="message-warning">{suggestionErrorMessage}</div>
              ) : (
                <div></div>
              )}
              <Button
                variant="contained"
                size="small"
                className={useStyles.button}
                onClick={this.onClickSubmit}
              >
                {" "}
                Submit{" "}
              </Button>
            </FormControl>
          </div>
        </Container>
      );
    }
  }
);
