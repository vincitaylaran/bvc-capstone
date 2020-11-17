import { observable } from "mobx";
import config from "../config.json";
import axios from "axios";

const ModelSuggestions = observable({
  userName: "",
  email: "",
  option: "",
  suggestion: "",
  userErrorMessage: "",
  emailErrorMessage: "",
  optionErrorMessage: "",
  suggestionErrorMessage: ""
});

ModelSuggestions.setUserName = function(value) {
  this.userName = value;
};

ModelSuggestions.getUserName = function() {
  return this.userName;
};

ModelSuggestions.setEmail = function(value) {
  this.email = value;
};

ModelSuggestions.getEmail = function() {
  return this.email;
};

ModelSuggestions.setOption = function(value) {
  this.option = value;
};

ModelSuggestions.getOption = function() {
  return this.option;
};

ModelSuggestions.setSuggestion = function(value) {
  this.suggestion = value;
};

ModelSuggestions.getSuggestion = function() {
  return this.suggestion;
};

ModelSuggestions.getUserErrorMessage = function() {
  return this.userErrorMessage;
};

ModelSuggestions.getEmailErrorMessage = function() {
  return this.emailErrorMessage;
};

ModelSuggestions.getOptionErrorMessage = function() {
  return this.optionErrorMessage;
};

ModelSuggestions.getSuggestionErrorMessage = function() {
  return this.suggestionErrorMessage;
};

ModelSuggestions.saveSuggestions = async function() {
  const endpoint = config.api + "/suggestion";
  if (!this.userName) {
    this.userErrorMessage = "Please enter your username.";
    return false;
  }
  if (!this.email) {
    this.emailErrorMessage = "Please enter your email.";
    return false;
  }
  if (!this.option) {
    this.optionErrorMessage = "Please select from drop down";
    return false;
  }
  if (!this.suggestion) {
    this.suggestionErrorMessage = "Please enter your suggestion";
    return false;
  }
  const payload = {
    userName: this.getUserName(),
    email: this.getEmail(),
    option: "CreateTechnologiesTutorials",
    suggestion: "test suggestion"
  };
  const configHeader = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  axios
    .post(endpoint, payload, configHeader)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
};

export { ModelSuggestions };
