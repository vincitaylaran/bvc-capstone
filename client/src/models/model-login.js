///
/// ModelLogin - Serves as a model for logging in.
///
import { observable } from "mobx";
import config  from "../config.json";

/// Model for logging-in.
export const ModelLogin = observable({
    username: "",
    password: "",
    confirm: "",
    message: "",
    success: false,
    authkey: config.authkey
    
});

///
/// Get and Set functions.
///
ModelLogin.getUsername = function() {
    return this.username;
}

ModelLogin.setUsername = function(value) {
    this.username = value;
}

ModelLogin.getPassword = function() {
    return this.password;
}

ModelLogin.setPassword = function(value) {
    this.password = value;
}

ModelLogin.getConfirm = function() {
    return this.confirm;
}

ModelLogin.setConfirm = function(value) {
    this.confirm = value;
}

ModelLogin.getSuccess = function() {
    return this.success;
}

ModelLogin.setSuccess = function(value) {
    this.success = value;
}

ModelLogin.getMessage = function() {
    return this.message;
}

ModelLogin.setMessage = function(value) {
    this.message = value;
}

ModelLogin.getTokenKey = function() {
    return this.authkey;
}

/// Reset model values.
ModelLogin.reset = function() {
    this.username = "";
    this.password = "";
    this.confirm = "";
    this.message = "";
    this.success = false;
}

/// Login
ModelLogin.login = async function() {
    if (!this.username) {
        this.message = "Please enter your username.";
        return { success: false, severity: 1};
    }

    if (!this.password) {
        this.message = "Please enter your password.";
        return { success: false, severity: 1};
    }
    
    const endpoint = config.api + "/login";
      
    try {
      var data = new URLSearchParams();
      data.append("username", this.username);
      data.append("password", this.password);
  
      const reply = await fetch(endpoint, { method: "POST", body: data });
      const result = await reply.json();
    
      this.password = "";

      if (result) {
          if (result.success) {
            this.message = "";
            return { success: true, token: result.token};
          }
          else {
            this.message = result.message;
            return { success: false, severity: 2};
          }
      }
    }
    catch (e) {
        console.error(`model-login Exception! e --> ${e}`);
    }

    this.message = "Error logging in.";
    return { success: false, severity: 2};;
  }

ModelLogin.resetPassword = async function() {
    if (!this.username) {
        this.message = "Please enter your username.";
        return { success: false, severity: 1};
    }

    const endpoint = config.api + "/forgot";
    try {
      var data = new URLSearchParams();
      data.append("username", this.username);
  
      const reply = await fetch(endpoint, { method: "POST", body: data });
      const result = await reply.json();
    
      if (result) {
          if (result.success) {
            this.message = window.location.origin + "/reset/" + result.token;
            return { success: true };
          }
          else {
            this.message = result.message;
            return { success: false, severity: 2};;
          }
      }
    }
    catch (e) {
        console.error(`model-login Exception! e --> ${e}`);
    }

    this.message = "Error confirming email.";
    return { success: false, severity: 2};;
  }

ModelLogin.changePassword = async function(token) {
    if (!this.password) {
        this.message = "Please enter new password.";
        return { success: false, severity: 1};
    }

    if (!this.confirm) {
        this.message = "Please confirm new password.";
        return { success: false, severity: 1};
    }

    if (this.confirm !== this.password) {
        this.message = "Passwords do not match.";
        return { success: false, severity: 1};
    }

    // Password regex

    const endpoint = config.api + "/reset";
    try {
      var data = new URLSearchParams();
      data.append("token", token);
      data.append("password", this.password);
  
      const reply = await fetch(endpoint, { method: "POST", body: data });
      const result = await reply.json();
    
      if (result) {
          if (result.success) {
            this.message = result.message;
            return { success: true };
          }
          else {
            this.message = result.message;
            return { success: false, severity: 2};
          }
      }
    }
    catch (e) {
        console.error(`model-login Exception! e --> ${e}`);
    }

    this.message = "Error changing password.";
    return { success: false, severity: 2};
  }

  ModelLogin.registerPassword = async function(token) {
    if (!this.password) {
        this.message = "Please enter new password.";
        return { success: false, severity: 1};
    }

    if (!this.confirm) {
        this.message = "Please confirm new password.";
        return { success: false, severity: 1};
    }

    if (this.confirm !== this.password) {
        this.message = "Passwords do not match.";
        return { success: false, severity: 1};
    }

    // Password regex

    const endpoint = config.api + "/password";
    try {
      var data = new URLSearchParams();
      data.append("token", token);
      data.append("password", this.password);
  
      const reply = await fetch(endpoint, { method: "POST", body: data });
      const result = await reply.json();
    
      if (result) {
          if (result.success) {
            this.message = result.message;
            return { success: true };
          }
          else {
            this.message = result.message;
            return { success: false, severity: 2};
          }
      }
    }
    catch (e) {
        console.error(`model-login Exception! e --> ${e}`);
    }

    this.message = "Error changing password.";
    return { success: false, severity: 2};
  }