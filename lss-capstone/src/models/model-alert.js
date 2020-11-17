import { observable } from "mobx";

/// Function for service page.
export const ModelAlert = observable({
  openState: false,
  title: "",
  message: "",
  okCaption: "OK",
  cancelCaption: "Cancel",
  okHandler: null,
  isConfirmDialog: false
});

ModelAlert.getOpenState = function() {
    return this.openState;
}

ModelAlert.setOpenState = function(value) {
    this.openState = value;
}

ModelAlert.getTitle = function() {
    return this.title;
}

ModelAlert.setTitle = function(value) {
    this.title = value;
}

ModelAlert.getMessage = function() {
    return this.message;
}

ModelAlert.setMessage = function(value) {
    this.message = value;
}

ModelAlert.getOkCaption = function() {
    return this.okCaption;
}

ModelAlert.setOkCaption = function(value) {
    this.okCaption = value;
}

ModelAlert.getCancelCaption = function() {
    return this.cancelCaption;
}

ModelAlert.setCancelCaption = function(value) {
    this.cancelCaption = value;
}

ModelAlert.getOkHandler = function() {
    return this.okHandler;
}

ModelAlert.setOkHandler = function(value) {
    this.okHandler = value;
}

ModelAlert.getIsConfirmDialog = function() {
    return this.isConfirmDialog;
}

ModelAlert.setIsConfirmDialog = function(value) {
    this.isConfirmDialog = value;
}

ModelAlert.reset = function() {
    this.openState = false;
    this.title = "";
    this.message = "";
    this.okCaption = "OK";
    this.cancelCaption = "Cancel";
    this.okHandler = null;
    this.cancelHandler = null;
    this.isConfirmDialog = false;
}
