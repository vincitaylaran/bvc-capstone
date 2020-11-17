///
/// ModelAdmin - Serves as a model for administrative stuff.
///

import { observable } from "mobx";
import config from "../config.json";
import ModelServiceObject from "./model-service-object.js";

/// Function for service page.
export const ModelDefaults = observable({
  defaultFields: [],
  customFieldModalState: false,
  newField: Object.assign({}, ModelServiceObject)
});

ModelDefaults.getFields = function() {
  return this.defaultFields;
};

ModelDefaults.getNewField = function() {
  return this.newField;
};
  
ModelDefaults.setNewField = function(value) {
  this.newField = value;
}
  
ModelDefaults.getCustomFieldPopup = function() {
  return this.customFieldModalState;
};
  
ModelDefaults.setCustomFieldPopup = function(open) {
  this.customFieldModalState = open;
};


/**************************
 * Default Fields Section *
 **************************/
ModelDefaults.createNewField = function() {
  this.newField = Object.assign({}, ModelServiceObject);
};
 
ModelDefaults.setEditField = function(value) {
  this.newField = Object.assign({}, value);
  this.newField.setOldCode(value.getCode());
}
  
ModelDefaults.getDefaultFields = async function() {
  const token = localStorage.getItem(config.authkey);

  const endpoint = config.api + "/defaultfields";
  const reply = await fetch(endpoint, { method: "GET", headers: {"Authorization": token}});
  let json = await reply.json();

  if (json.success) {
    ModelDefaults.defaultFields = json.result.map((f, index) => {
      const obj = Object.assign({}, ModelServiceObject);
      obj.setOrder(index);
      obj.setCode(f.code);
      obj.setDesc(f.description);
      obj.setRequired(f.required);
      obj.setType(f.type);
      obj.setLength(f.length);
      obj.setDefault(f.default);
      obj.setEnabled(f.enabled);
      if(f.selections !== undefined) {
        obj.setSelections(f.selections);
      }
      else {
        obj.setSelections("");
      }
      return obj;
    });

    
  } else {
    return { success: json.success, severity: 2, message: json.message };
  }
}

/// Add new field.
ModelDefaults.addNewField = async function() {
  if (this.newField.getType() === "") {
    return { success: false, severity: 1, message: "Please select a field type." }
  }

  if (this.newField.getDesc() === "") {
    return { success: false, severity: 1, message: "Please add a field display." }
  }

  const num = parseInt(this.newField.getLength(), 10); 
  if (isNaN(num) || num < 0) {
    return { success: false, severity: 1, message: "Field length should be a positive whole number or zero." }
  }

  const data = new URLSearchParams();
  data.append("token", localStorage.getItem(config.authkey));
  data.append("desc", this.newField.getDesc());
  data.append("req", this.newField.getRequired());
  data.append("type", this.newField.getType());
  data.append("len", this.newField.getLength());
  data.append("def", this.newField.getDefault());
  data.append("enabled", this.newField.getEnabled());
  data.append("sel", await this.newField.getSelectionsString());

  const endpoint = config.api + "/defaultfields";
  const reply = await fetch(endpoint, { method: "POST", body: data });
  let json = await reply.json();

  if (json.success) {
    this.newField.setSelection("");
    this.defaultFields.push(Object.assign({}, this.newField));
    this.newField = Object.assign({}, ModelServiceObject);

    return json;
  } else {
    return { success: json.success, severity: 2, message: json.message };
  }
}
  
/// Delete a field.
ModelDefaults.removeField = async function(field) {
  
  const data = new URLSearchParams();
  data.append("token", localStorage.getItem(config.authkey));
  data.append("code", field.getCode());
  
  const endpoint = config.api + "/defaultfields";
  const reply = await fetch(endpoint, {method: "DELETE", body: data });
  let json = await reply.json();

  if(json.success) {
    let fields = ModelDefaults.getFields();
    let index = 0;
    while (index < fields.length) {
      if (fields[index].getCode()=== field.getCode()) {
        fields.splice(index, 1);
        break;
      }
      index++;
    }

    return json;
  }
  else {
    return { success : json.success, severity: 2, message: json.message };
  }
}
  
/// Add new field.
ModelDefaults.updateField = async function() {
  if (ModelDefaults.newField.getType() === "") {
    return { success: false, severity: 1, message: "Please select a field type." }
  }

  if (ModelDefaults.newField.getDesc() === "") {
    return { success: false, severity: 1, message: "Please add a field display." }
  }

  const num = parseInt(ModelDefaults.newField.getLength(), 10); 
  if (isNaN(num) || num < 0) {
    return { success: false, severity: 1, message: "Field length should be a positive whole number or zero." }
  }

  const data = new URLSearchParams();
  data.append("token", localStorage.getItem(config.authkey));
  data.append("oldcode", ModelDefaults.newField.getOldCode());
  data.append("code", ModelDefaults.newField.getCode());
  data.append("desc", ModelDefaults.newField.getDesc());
  data.append("req", ModelDefaults.newField.getRequired());
  data.append("type", ModelDefaults.newField.getType());
  data.append("len", ModelDefaults.newField.getLength());
  data.append("def", ModelDefaults.newField.getDefault());
  data.append("enabled", ModelDefaults.newField.getEnabled());
  data.append("sel", await ModelDefaults.newField.getSelections());

  const endpoint = config.api + "/defaultfields";
  const reply = await fetch(endpoint, {method: "PUT", body: data });
  let json = await reply.json();

  if(json.success) {
    let fields = ModelDefaults.getFields();
    let update = ModelDefaults.getNewField();
    let index = 0;
    
    while (index < fields.length) {
      if (fields[index].getCode() === update.getOldCode()) {
        fields.splice(index, 1);
        fields.splice(index, 0, update);
        break;
      }
      index++;
    }

    ModelDefaults.newField = Object.assign({}, ModelServiceObject);

    return json;
  }
  else {
    return { success : json.success, severity: 2, message: json.message };
  }
}


export default ModelDefaults;