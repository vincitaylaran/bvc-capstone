import { observable } from "mobx";

/// Function for service page.
export const ModelServiceObject = observable({
  order: 0,
  oldCode: "",
  code: "",
  desc: "",
  required: false,
  type: "text",
  length: 0,
  default: false,
  enabled: true,
  value: "",
  selection: "",
  selections: "",
  types: [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "multitext", label: "Multiple Lines" },
    { value: "checkbox", label: "Checkbox" },
    { value: "date", label: "Date" },
    { value: "time", label: "Time" },
    { value: "selection", label: "Selection" }
  ]
});

ModelServiceObject.getOrder = function() {
  return this.order;
};

ModelServiceObject.setOrder = function(value) {
  this.order = value;
};

ModelServiceObject.getOldCode = function() {
  return this.oldCode;
};

ModelServiceObject.setOldCode = function(value) {
  this.oldCode = value;
};

ModelServiceObject.getCode = function() {
  return this.code;
};

ModelServiceObject.setCode = function(value) {
  this.code = value;
};

ModelServiceObject.getDesc = function() {
  return this.desc;
};

ModelServiceObject.setDesc = function(value) {
  this.desc = value;
};

ModelServiceObject.getRequired = function() {
  return this.required;
};

ModelServiceObject.setRequired = function(value) {
  this.required = value;
};

ModelServiceObject.getType = function() {
  return this.type;
};

ModelServiceObject.setType = function(value) {
  this.type = value;
};

ModelServiceObject.getLength = function() {
  return this.length;
};

ModelServiceObject.setLength = function(value) {
  this.length = value;
};

ModelServiceObject.getDefault = function() {
  return this.default;
};

ModelServiceObject.setDefault = function(value) {
  this.default = value;
};

ModelServiceObject.getEnabled = function() {
  return this.enabled;
};

ModelServiceObject.setEnabled = function(value) {
  this.enabled = value;
};

ModelServiceObject.getTypes = function() {
  return this.types;
};

ModelServiceObject.getSelection = function() {
  return this.selection;
};

ModelServiceObject.setSelection = function(value) {
  this.selection = value;
};

ModelServiceObject.getValue = function() {
  return this.value;
};

ModelServiceObject.setValue = function(value) {
  this.value = value;
};

ModelServiceObject.getSelections = function() {
  if (this.selections) {
    return JSON.parse(this.selections);
  } else {
    return [];
  }
};

ModelServiceObject.getSelectionsString = function() {
  return this.selections;
};

ModelServiceObject.setSelections = function(value) {
  this.selections = value;
};

ModelServiceObject.reset = function() {
  this.order = 0;
  this.oldCode = "";
  this.code = "";
  this.desc = "";
  this.required = false;
  this.type = "text";
  this.length = 0;
  this.default = false;
  this.enabled = true;
  this.selection = "";
  this.selections = "";
  this.value = "";
};

ModelServiceObject.addSelection = function() {
  let s = [];
  if (this.selections) {
    if (this.selections === "[]") {
      s.push(this.selection);
      this.selections = JSON.stringify(s);
    } else {
      s = JSON.parse(this.selections);
      s.push(this.selection);
      this.selections = JSON.stringify(s);
    }
  } else {
    s.push(this.selection);
    this.selections = JSON.stringify(s);
  }
};

ModelServiceObject.removeSelection = function(index) {
  let s = JSON.parse(this.selections);

  if (s.length > index) {
    s.splice(index, 1);
    if (s.length > 0) {
      this.selections = JSON.stringify(s);
    } else {
      this.selections = "";
    }
  }
};

export default ModelServiceObject;
