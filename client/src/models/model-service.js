///
/// ModelService - Serves as a model for service objects.
///

import { observable } from "mobx";
import config from "../config.json";
import ModelServiceObject from "./model-service-object.js";
// import modelGetCarousel from "./model-carousel.js";
// import { toJS } from "mobx";

/// Function for service page.
export const ModelService = observable({
  id: "",
  sid: "", // Also URL.
  code: "",
  desc: "", // Service name.
  colour: "",
  booking_type: [],
  req: "",
  findServiceString: "",
  paging: {
    page: 1,
    row: 5,
  },
  fields: [],
  newField: Object.assign({}, ModelServiceObject),
  customFieldModalState: false,
  tempserviceslist: [],
  serviceslist: [],
  descriptions: [],
});

///
/// Get and Set functions.
///
ModelService.clearModel = function () {
  this.id = "";
  this.sid = "";
  this.desc = "";
  this.colour = "";
  this.booking_type = [];
  this.req = "";
  this.findServiceString = "";
  this.paging = {
    page: 1,
    row: 5,
  };
  this.fields = [];
  this.serviceslist = [];
};

ModelService.getId = function () {
  return this.id;
};

ModelService.setId = function (value) {
  this.id = value;
};

ModelService.getSid = function () {
  return this.sid;
};

ModelService.setSid = function (value) {
  this.sid = value;
};

ModelService.getDesc = function () {
  return this.desc;
};

ModelService.setDesc = function (value) {
  this.desc = value;
};

ModelService.setCode = function (value) {
  this.code = value;
};

ModelService.getCode = function () {
  return this.code;
};

ModelService.getUrl = function () {
  return this.url;
};

ModelService.setUrl = function (value) {
  this.url = value;
};

ModelService.getColour = function () {
  return this.colour;
};

ModelService.setColour = function (value) {
  this.colour = value;
};

ModelService.getServicesList = function () {
  return this.serviceslist;
};

ModelService.gettempServicesList = function () {
  return this.tempserviceslist;
};

ModelService.getFields = function () {
  return this.fields;
};

ModelService.getBookingType = function () {
  return this.booking_type;
};

ModelService.setBookingType = function (value) {
  this.booking_type = value;
};

ModelService.getNewField = function () {
  return this.newField;
};

ModelService.setNewField = function (value) {
  this.newField = value;
};

ModelService.getCustomFieldPopup = function () {
  return this.customFieldModalState;
};

ModelService.setCustomFieldPopup = function (open) {
  this.customFieldModalState = open;
};

ModelService.setPageNumber = function (value) {
  this.paging.page = this.paging.page + value;
};
ModelService.getPageNumber = function () {
  return this.paging.page;
};
ModelService.setPageRow = function (value) {
  if (value === -1) this.paging.row = this.serviceslist.length;
  else this.paging.row = value;
  this.paging.page = 1;
};
ModelService.getPageRow = function () {
  return this.paging.row;
};

ModelService.getFindService = function () {
  return this.findServiceString;
};

ModelService.setFindService = function (value) {
  this.findServiceString = value;
  let temRow = [];
  this.serviceslist.forEach((element) => {
    if (
      element.desc.toLowerCase().includes(this.findServiceString.toLowerCase())
    ) {
      temRow.push(element);
    }
  });
  this.serviceslist = temRow;
};

ModelService.setUsers = async function () {
  let usersList = await this.props.model.roleModel.getRoleData();
  this.users = usersList.Array;
};

ModelService.getUsers = function () {
  return this.users;
};
///update service
ModelService.updateService = async function (oldSid) {
  if (!this.isServiceNameValid()) {
    return { 
      success: false, 
      severity: 1, 
      message:"Invalid Service Name."
    }
  }

  if (!this.isUrlValid()) {
    return { 
      success: false, 
      severity: 1, 
      message:"Invalid Service URL."
    }
  }

  if (this.colour === "") {
    return { 
      success: false, 
      severity: 1, 
      message:"Please select Theme Colour."
    }
  }

  if (this.booking_type.length === 0) {
    return { 
      success: false, 
      severity: 1, 
      message:"Please select at least one Type."
    }
  }
  
  const data = new URLSearchParams();
  data.append("token", localStorage.getItem(config.authkey));
  data.append("sid", oldSid);
  data.append("newsid", this.sid);
  data.append("colour", this.colour);
  data.append("desc", this.desc);
  data.append("booking_type", JSON.stringify(this.booking_type));

  const endpoint = config.api + "/service";
  try {
    const reply = await fetch(endpoint, { method: "PUT", body: data });
    let json = await reply.json();
    return json;
  }
  catch(err) {
    console.error("Error updating service.", err);
  }

  return { 
    success: false, 
    severity: 2, 
    message: "An error ocurred. Service could not be updated."};
  
};

/// Connects to the database to get a specific service.
ModelService.getServiceData = async (sid) => {
  const endpoint = config.api + "/service?s=" + sid;

  const token = localStorage.getItem(config.authkey);

  let apiResponse = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization: token },
  });

  let Reply = await apiResponse.json();

  if (Reply.success) {
    ModelService.setSid(Reply.result.sid);
    ModelService.setDesc(Reply.result.desc);
    ModelService.setColour(Reply.result.colour);
    ModelService.setBookingType(Reply.result.booking_type);
    ModelService.fields = Reply.result.fields.map((f, index) => {
      const obj = Object.assign({}, ModelServiceObject);
      obj.setOrder(index);
      obj.setCode(f.code);
      obj.setDesc(f.description);
      obj.setRequired(f.required);
      obj.setType(f.type);
      obj.setLength(f.length);
      obj.setDefault(f.default);
      obj.setEnabled(f.enabled);
      if (f.selections !== undefined) {
        obj.setSelections(f.selections);
      } else {
        obj.setSelections("");
      }
      return obj;
    });
  }
};

/// Connects to the database to get all services.
ModelService.getServicesData = async () => {
  const endpoint = config.api + "/services";
  const token = localStorage.getItem(config.authkey);

  let apiResponse = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization: token },
  });

  let Reply = await apiResponse.json();
  if (Reply.success) {
    ModelService.tempserviceslist = Reply.result;
    ModelService.serviceslist = Reply.result.map((s, index) => {
      const obj = Object.assign({}, ModelServiceObject);
      obj.setOrder(index);
      obj.setCode(s.sid);
      obj.setDesc(s.desc);

      return obj;
    });
  }
};

/// Saves the data to the database.
ModelService.saveServiceData = async () => {
  if (!ModelService.isServiceNameValid()) {
    return { 
      success: false, 
      severity: 1, 
      message:"Invalid Service Name."
    }
  }

  if (!ModelService.isUrlValid()) {
    return { 
      success: false, 
      severity: 1, 
      message:"Invalid Service URL."
    }
  }

  if (ModelService.colour === "") {
    return { 
      success: false, 
      severity: 1, 
      message:"Please select Theme Colour."
    }
  }

  if (ModelService.booking_type.length === 0) {
    return { 
      success: false, 
      severity: 1, 
      message:"Please select at least one Type."
    }
  }

  const endpoint = config.api + "/service";

  try {
    const data = new URLSearchParams();
    data.append("token", localStorage.getItem(config.authkey));
    data.append("sid", ModelService.sid);
    data.append("desc", ModelService.desc);
    data.append("colour", ModelService.colour);
    data.append("bookingType", JSON.stringify(ModelService.booking_type));

    let apiResponse = await fetch(endpoint, {
      method: "POST",
      body: data,
    });
    let reply = await apiResponse.json();
    return reply;
  }
  catch(e) {
    console.error("Error saving service.", e);
  }

  return { 
    success: false, 
    severity: 2, 
    message:"An error ocurred. Service could not be saved."
  }
};

/// Checks the input for the service's name for acceptable inputs values.
ModelService.isServiceNameValid = function(){
  const serviceName = this.desc.trim();
  let regex = new RegExp(/[^0-9a-zA-Z'_-\s]+$/);

  if (regex.test(serviceName) || serviceName === "") {
    return false;
  } else {
    return true;
  }
};

/// Checks the user's custom URL for acceptable inputs.
ModelService.isUrlValid = function() {
  const url = this.sid.trim();
  let regex = new RegExp("[^0-9a-zA-Z'_-]+$");

  // Check that URL is valid.
  if (regex.test(url) || url === "") {
    return false;
  } else {
    return true;
  }
};

/**************************
 * Service Fields Section *
 **************************/
ModelService.createNewField = function () {
  this.newField = Object.assign({}, ModelServiceObject);
};

ModelService.setEditField = function (value) {
  this.newField = Object.assign({}, value);
  this.newField.setOldCode(value.getCode());
};

/// Add new field.
ModelService.addNewField = async function () {
  if (this.newField.getType() === "") {
    return {
      success: false,
      severity: 1,
      message: "Please select a field type.",
    };
  }

  if (this.newField.getDesc() === "") {
    return {
      success: false,
      severity: 1,
      message: "Please add a field display.",
    };
  }

  const num = parseInt(this.newField.getLength(), 10);
  if (isNaN(num) || num < 0) {
    return {
      success: false,
      severity: 1,
      message: "Field length should be a positive whole number or zero.",
    };
  }

  const data = new URLSearchParams();
  data.append("token", localStorage.getItem(config.authkey));
  data.append("sid", this.sid);
  data.append("desc", this.newField.getDesc());
  data.append("req", this.newField.getRequired());
  data.append("type", this.newField.getType());
  data.append("len", this.newField.getLength());
  data.append("def", this.newField.getDefault());
  data.append("enabled", this.newField.getEnabled());
  data.append("sel", await this.newField.getSelectionsString());

  const endpoint = config.api + "/servicefields";
  const reply = await fetch(endpoint, { method: "POST", body: data });
  let json = await reply.json();

  if (json.success) {
    this.newField.setSelection("");
    this.fields.push(Object.assign({}, this.newField));
    this.newField = Object.assign({}, ModelServiceObject);

    return json;
  } else {
    return { success: json.success, severity: 2, message: json.message };
  }
};

/// Delete a field.
ModelService.removeField = async function (field) {
  const data = new URLSearchParams();
  data.append("token", localStorage.getItem(config.authkey));
  data.append("sid", ModelService.getSid());
  data.append("code", field.getCode());

  const endpoint = config.api + "/servicefields";
  const reply = await fetch(endpoint, { method: "DELETE", body: data });
  let json = await reply.json();

  if (json.success) {
    let fields = ModelService.getFields();
    let index = 0;
    while (index < fields.length) {
      if (fields[index].getCode() === field.getCode()) {
        fields.splice(index, 1);
        break;
      }
      index++;
    }

    return json;
  } else {
    return { success: json.success, severity: 2, message: json.message };
  }
};

/// Add new field.
ModelService.updateField = async function () {
  if (ModelService.newField.getType() === "") {
    return {
      success: false,
      severity: 1,
      message: "Please select a field type.",
    };
  }

  if (ModelService.newField.getDesc() === "") {
    return {
      success: false,
      severity: 1,
      message: "Please add a field display.",
    };
  }

  const num = parseInt(ModelService.newField.getLength(), 10);
  if (isNaN(num) || num < 0) {
    return {
      success: false,
      severity: 1,
      message: "Field length should be a positive whole number or zero.",
    };
  }

  const data = new URLSearchParams();
  data.append("token", localStorage.getItem(config.authkey));
  data.append("sid", ModelService.sid);
  data.append("oldcode", ModelService.newField.getOldCode());
  data.append("code", ModelService.newField.getCode());
  data.append("desc", ModelService.newField.getDesc());
  data.append("req", ModelService.newField.getRequired());
  data.append("type", ModelService.newField.getType());
  data.append("len", ModelService.newField.getLength());
  data.append("def", ModelService.newField.getDefault());
  data.append("enabled", ModelService.newField.getEnabled());
  data.append("sel", await ModelService.newField.getSelectionsString());

  const endpoint = config.api + "/servicefields";
  const reply = await fetch(endpoint, { method: "PUT", body: data });
  let json = await reply.json();

  if (json.success) {
    let fields = ModelService.getFields();
    let update = Object.assign({}, ModelService.getNewField());
    let index = 0;

    while (index < fields.length) {
      if (fields[index].getCode() === update.getOldCode()) {
        fields.splice(index, 1);
        fields.splice(index, 0, update);
        break;
      }
      index++;
    }

    ModelService.newField = Object.assign({}, ModelServiceObject);

    return json;
  } else {
    return { success: json.success, severity: 2, message: json.message };
  }
};

ModelService.setServiceDescriptions = async function () {
  const endpoint = `${config.api}/p/service_descriptions`;
  const payload = { method: "GET" };
  const reply = await fetch(endpoint, payload);
  const result = await reply.json();

  if (result.success) {
    this.descriptions = result.result;
  } else {
    this.descriptions = [];
  }
};

ModelService.getServiceDescriptions = function () {
  return this.descriptions;
};

export default ModelService;
