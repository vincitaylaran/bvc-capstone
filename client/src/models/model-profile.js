import { observable } from "mobx";
import config from "../config.json";

const ModelProfile = observable({
  email : "",
  fname: "",
  lname: "",
  nickname: "",
  password: "",
  newpassword: "",
  confirmpassword: ""
});

ModelProfile.getEmail = function() {
  return this.email;
}

ModelProfile.setEmail = function(value) {
  this.email = value;
}

ModelProfile.getFirstname = function() {
  return this.fname;
}

ModelProfile.setFirstname = function(value) {
  this.fname = value;
}

ModelProfile.getLastname = function() {
  return this.lname;
}

ModelProfile.setLastname = function(value) {
  this.lname = value;
}

ModelProfile.getNickname = function() {
  return this.nickname;
}

ModelProfile.setNickname = function(value) {
  this.nickname = value;
}

ModelProfile.getPassword = function() {
  return this.password;
}

ModelProfile.setPassword = function(value) {
  this.password = value;
}

ModelProfile.getNewPassword = function() {
  return this.newpassword;
}

ModelProfile.setNewPassword = function(value) {
  this.newpassword = value;
}

ModelProfile.getConfirmPassword = function() {
  return this.confirmpassword;
}

ModelProfile.setConfirmPassword = function(value) {
  this.confirmpassword = value;
}

/*********
 * Reset *
 *********/

ModelProfile.resetProfile = function() {
  this.email = "";
  this.fname = "";
  this.lname = "";
  this.nickname = "";
}

ModelProfile.resetPassword = function() {
  this.password = "";
  this.newpassword = "";
  this.confirmpassword = "";
}

/*******************************
 * Update Profile and Password *
 *******************************/

ModelProfile.updateProfile = async function() {
  if (this.email.trim() === "") {
    return { success: false, severity: 1, message: "Email required."};
  }

  const endpoint = config.api + "/profile";

  try{
    const token = localStorage.getItem(config.authkey);

    let data = new URLSearchParams();
    data.append("email", this.email);
    data.append("fname", this.fname);
    data.append("lname", this.lname);
    data.append("nname", this.nickname);
    data.append("token", token);

    const reply = await fetch(endpoint, { method: "PUT", body: data });
    const result = await reply.json();
    return result;
  }
  catch(e) {
    console.error(`model-profile Exception! e --> ${e}`);
  }
  return { success: false, severity: 2, message: "Error updating profile."};
};

ModelProfile.updatePassword = async function() {
  if (this.password.trim() === "") {
    return { success: false, severity: 1, message: "Password required."};
  }

  if (this.newpassword.trim() === "") {
    return { success: false, severity: 1, message: "New Password required."};
  }

  if (this.confirmpassword.trim() === "") {
    return { success: false, severity: 1, message: "Confirm Password required."};
  }

  if (this.newpassword !== this.confirmpassword) {
    return { success: false, severity: 1, message: "New Passwords do not match."};
  }

  const endpoint = config.api + "/password";

  try{
    const token = localStorage.getItem(config.authkey);

    let data = new URLSearchParams();
    data.append("password", this.password);
    data.append("newpassword", this.newpassword);
    data.append("confirmpassword", this.confirmpassword);
    data.append("token", token);

    const reply = await fetch(endpoint, { method: "PUT", body: data });
    const result = await reply.json();
    return result;
  }
  catch(e) {
    console.error(`model-profile Exception! e --> ${e}`);
  }
  return { success: false, severity: 2, message: "Error updating password."};
};

export { ModelProfile };
