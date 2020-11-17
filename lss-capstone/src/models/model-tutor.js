import { observable } from "mobx";
import config from "../config.json";

const ModelTutor = observable({
  sid: "",
  email: "",
  firstName: "",
  lastName: "",
  nickname: "",
  url: "",
  status: "",
  roles: []
});

ModelTutor.getSid = function() {
  return this.sid;
}

ModelTutor.setSid = function(value){
  this.sid = value;
}

ModelTutor.getEmail = function() {
  return this.email;
};

ModelTutor.setEmail = function(value) {
  this.email = value;
};

ModelTutor.getFirstName = function() {
  return this.firstName;
};

ModelTutor.setFirstName = function(value) {
  this.firstName = value;
};

ModelTutor.getLastName = function() {
  return this.lastName;
};

ModelTutor.setLastName = function(value) {
  this.lastName = value;
};

ModelTutor.getNickName = function() {
  return this.nickname;
};

ModelTutor.setNickName = function(value) {
  this.nickname = value;
};

ModelTutor.getUrl = function() {
  return this.url;
};

ModelTutor.setUrl = function(value) {
  this.url = value;
};

ModelTutor.getStatus = function() {
  return this.status;
}

ModelTutor.setStatus = function(value) {
  this.status = value;
}

ModelTutor.getRoles = function() {
  return this.roles;
};

ModelTutor.setRoles = function(value) {
  this.roles = value;
};

/***********
 * Methods *
 ***********/

ModelTutor.reset = function() {
  this.sid = "";
  this.email = "";
  this.firstName = "";
  this.lastName = "";
  this.nickname = "";
  this.roles = [];
}

ModelTutor.sendInvite = async function(roles) {
  try {
    const endpoint = config.api + "/user";
    var data = new URLSearchParams();
    data.append("email", this.email);
    data.append("roles", JSON.stringify(roles));
    data.append("token", localStorage.getItem(config.authkey))
    data.append("url", this.url);

    const reply = await fetch(endpoint, { method: "POST", body: data });
    const result = await reply.json();
    return result;
  } catch (e) {
    console.error("model-add-tutor Exception! e --> ", e);
  }
  return { success: false, severity: 2, 
    message: "An error ocurred in inviting user."};
};

ModelTutor.updateRoles = async function(roles) {
  try {
    const endpoint = config.api + "/user_roles";

    var data = new URLSearchParams();
    data.append("sid", this.sid);
    data.append("roles", JSON.stringify(roles));
    data.append("token", localStorage.getItem(config.authkey))

    const reply = await fetch(endpoint, { method: "PUT", body: data });
    const result = await reply.json();
    return result;
  } catch (e) {
    console.error("model-add-tutor Exception! e --> ", e);
  }
  return { success: false, severity: 2, 
    message: "An error ocurred in updating user roles."};
};

ModelTutor.getUserFromSid = async function(sid) {
  
  try {
    const endpoint = config.api + "/user?sid=" + sid;

    const token = localStorage.getItem(config.authkey);
    
    const  reply = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: token }
    });

    const json = await reply.json();
    if (json.success) {
      this.sid = json.result.sid;
      this.email = json.result.email;
      this.firstName = json.result.fname;
      this.lastName = json.result.lname;
      this.nickname = json.result.nname;
      this.status = json.result.status;
      this.roles = json.result.roles.map(r => { return r; });
    }
    
  } catch (e) {
    console.error("model-add-tutor Exception! e --> ", e);
  }
  return false;
};

export { ModelTutor };
