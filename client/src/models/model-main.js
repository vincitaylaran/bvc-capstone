import { observable } from "mobx";
import { ModelWaitlist } from "./model-waitlist";
import { ModelLogin } from "./model-login.js";
import modelGetCarousel from "./model-carousel";
import { ModelUser } from "./model-user";
import { ModelTutee } from "./model-tutee";
import { ModelAppointment } from "./model-appointment";
import { ModelService } from "./model-service.js";
import { ModelCheckboxes } from "./model-checkboxes.js";
import { ModelRole } from "./model-roles.js";
import { ModelTutor } from "./model-tutor";
import { ModelReview } from "./model-review";
import { ModelProfile } from "./model-profile";
import { ModelToast } from "./model-toast.js";
import { ModelMenu } from "./model-menu.js";
import { ModelOfferred } from "./model-offerered-services";
import { ModelWalkIn } from "./model-walk-in";
import { ModelAlert } from "./model-alert.js";
import { ModelDefaults } from "./model-defaults.js";
import { ModelProgress } from "./model-progress.js";
import { ModelBookings } from "./model-bookings";
import { ModelSuggestions } from "./model-suggestions";

import { toast } from "react-toastify";
import config from "../config.json";

/// Base model of the app. Holds values taken from the jwt token.
const ModelMain = observable({
  appName: config.app_title,
  logged: false,
  jwt: "",
  iat: 0,
  sub: "",
  sid: "",
  fname: "",
  lname: "",
  nickname: "",
  canDashboard: true,
  canList: false,
  canReports: false,
  canServices: false,
  canRoles: false,
  canUsers: false,
  canAdmin: false,
  services: [],
  service: "",
  alertModel: ModelAlert,
  loginModel: ModelLogin,
  walkinModel: ModelWalkIn,
  userModel: ModelUser,
  roleModel: ModelRole,
  offeredModel: ModelOfferred,
  serviceModel: ModelService,
  displayModel: modelGetCarousel,
  tuteeModel: ModelTutee,
  appointmentModel: ModelAppointment,
  reviewModel: ModelReview,
  tutorModel: ModelTutor,
  toast: ModelToast,
  profile: ModelProfile,
  menuModel: ModelMenu,
  waitlistModel: ModelWaitlist,
  defaultsModel: ModelDefaults,
  progressModel: ModelProgress,
  checkboxesModel: ModelCheckboxes,
  suggestions: ModelSuggestions,
  bookingsModel: ModelBookings
});

/*****************************
  Get and Set for properties
******************************/
ModelMain.getAppName = function() {
  return this.appName;
};

ModelMain.isLogged = function() {
  return this.logged;
};

ModelMain.getSub = function() {
  return this.sub;
};

ModelMain.getSid = function() {
  return this.sid;
};

ModelMain.getFirstname = function() {
  return this.fname;
};

ModelMain.getLastname = function() {
  return this.lname;
};

ModelMain.getNickname = function() {
  return this.nickname;
};

ModelMain.getService = function() {
  if (this.services.length === 1) return this.services[0];
  else return null;
};

ModelMain.getServices = function() {
  return this.services;
};

ModelMain.setService = function(value) {
  this.service = value;
};

ModelMain.getCanDashboard = function() {
  return this.canDashboard;
};

ModelMain.getCanLists = function() {
  return this.canList;
};

ModelMain.getCanReports = function() {
  return this.canReports;
};

ModelMain.getCanRoles = function() {
  return this.canRoles;
};

ModelMain.getCanServices = function() {
  return this.canServices;
};

ModelMain.getCanUsers = function() {
  return this.canUsers;
};

ModelMain.getCanAdmin = function() {
  return this.canAdmin;
};

ModelMain.getToken = function() {
  return this.jwt;
};

/**********
  Methods
***********/

//
ModelMain.setCredentials = function(value) {
  if (value) {
    const parts = value.split(".");

    // If token not equal to 3 parts, return.
    if (parts.length !== 3) {
      return false;
    }

    try {
      const json = JSON.parse(window.atob(parts[1]));
      this.jwt = value;
      this.sub = json.sub;
      this.sid = json.sid;
      this.iat = json.iat;
      this.fname = json.fna;
      this.lname = json.lna;
      this.nickname = json.ali;
      this.canAdmin = json.prv.includes("adm");
      this.canDashboard = json.prv.includes("brd") || this.canAdmin;
      this.canList = json.prv.includes("lst") || this.canAdmin;
      this.canReports = json.prv.includes("rpt") || this.canAdmin;
      this.canRoles = json.prv.includes("rol") || this.canAdmin;
      this.canServices = json.prv.includes("svc") || this.canAdmin;
      this.canUsers = json.prv.includes("usr") || this.canAdmin;
      this.services = json.svc.map(s => {
        return s;
      });

      // If everything went well...
      this.logged = true;

      return true;
    } catch (ex) {
      return false;
    }
  }

  return false;
};

ModelMain.reset = function() {
  // Reset each values.
  this.logged = false;
  this.jwt = "";
  this.sub = "";
  this.iat = 0;
  this.fname = "";
  this.lname = "";
  this.nickname = "";
  this.canDashboard = true;
  this.canList = false;
  this.canReports = false;
  this.canServices = false;
  this.canRoles = false;
  this.canUsers = false;
  this.canAdmin = false;
  this.services = [];

  // Reset each models.
  this.loginModel.reset();
  /*
  userModel: null,
  roleModel: null,
  serviceModel: null,
  displayModel: modelGetCarousel,
  appointmentModel: ModelAppointment
  */
};

ModelMain.logout = function() {
  ModelMain.reset();
};

/// Generate SID based on the role name.
/// Currently DOES NOT verify the SID does not exist.
/// Params:
///     @name - the name of whatever you want to generate an SID for. (Ex:
///             "Dylan's Tutoring Services").
ModelMain.generateSid = function(name) {
  let sidPrefix = null;

  // If this.desc is multiple words, create initialism,
  // and append the last word to the end.
  if (name.includes(" ")) {
    // '/g' = 'global'; Continues searching until end of string.
    sidPrefix = name.match(/\b(\w)/g);
    sidPrefix = sidPrefix.join("").toUpperCase();

    let lastWord = name.split(" ");
    lastWord = lastWord[lastWord.length - 1];

    // Replace the last char with the entire last word.
    sidPrefix = sidPrefix.substring(0, sidPrefix.length - 1);
    sidPrefix += lastWord;
  } else {
    // Else, save the single word.
    sidPrefix = name;
  }

  // Creates an SID beginning with "sidPrefix" followed by an undrescore, then
  // a pseudo-random three-digit ID.
  let sid = require("node-sid")().create(sidPrefix, 3);
  // Remove the underscore.
  sid = sid.replace("_", "");

  return sid;
};

/************************
 * Alert/Confirm Dialog *
 ************************/

/// Displays an alert dialog.
ModelMain.showAlertDialog = function(title, message, okCaption, okHandler) {
  this.alertModel.setTitle(title);
  this.alertModel.setMessage(message);
  this.alertModel.setOkCaption(okCaption);

  const okFunction = async function() {
    if (okHandler) {
      await okHandler();
    }
    await ModelMain.alertModel.reset();
  };

  this.alertModel.setOkHandler(okFunction);
  this.alertModel.setIsConfirmDialog(false);
  this.alertModel.setOpenState(true);
};

/// Displays a confirm dialog.
ModelMain.showConfirmDialog = function(
  title,
  message,
  okCaption,
  cancelCaption,
  okHandler
) {
  this.alertModel.setTitle(title);
  this.alertModel.setMessage(message);
  this.alertModel.setOkCaption(okCaption);
  this.alertModel.setCancelCaption(cancelCaption);

  const okFunction = async function() {
    await okHandler();
    await ModelMain.alertModel.reset();
  };

  this.alertModel.setOkHandler(okFunction);
  this.alertModel.setIsConfirmDialog(true);
  this.alertModel.setOpenState(true);
};

/// Manually close a dialog.
ModelMain.closeDialog = function() {
  this.alertModel.reset();
};

/*********
 * Toast *
 *********/
ModelMain.toastSuccess = function(message) {
  toast.success(message, {
    className: "toast-success toast-base"
  });
};

ModelMain.toastWarn = function(message) {
  toast.warn(message, {
    className: "toast-warning toast-base"
  });
};

ModelMain.toastError = function(message) {
  toast.error(message, {
    className: "toast-failure toast-base"
  });
};

ModelMain.toastResult = function(result) {
  // result = { success: bool, severity: 0-2, message: string}
  if (result.success) {
    toast.success(result.message, {
      className: "toast-success toast-base"
    });
  } else {
    if (result.severity === 1) {
      toast.warn(result.message, {
        className: "toast-warning toast-base"
      });
    } else {
      toast.error(result.message, {
        className: "toast-failure toast-base"
      });
    }
  }
};

/******************
 * Modal Progress *
 ******************/

ModelMain.showProgress = function() {
  ModelMain.progressModel.show();
};

ModelMain.hideProgress = function() {
  setTimeout(() => {ModelMain.progressModel.hide();}, 500);
};

/******************
 * Email URL *
 ******************/

ModelMain.getUrlRoot = function() {
  return document.location.protocol + 
    (document.location.protocol ? "//" : "") +
    document.location.host;
}

ModelMain.emailInvitationUrl = function(token) {
  return document.location.protocol + 
    (document.location.protocol ? "//" : "") +
    document.location.host + 
    "/invite?token=" + token;
}

export default ModelMain;
