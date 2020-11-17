///
/// ModelWalkIn - Serves as a model for service objects.
///

import { observable } from "mobx";
import config from "../config.json";
import ModelWalkInObject from "./model-service-object.js";

/// Function for service page.
export const ModelWalkIn = observable({
  sid: "", // SID.
  desc: "", // Service name.
  colour: "",
  fields: [],
});

ModelWalkIn.getCode = function () {
  return this.sid;
};

ModelWalkIn.setCode = function (value) {
  this.sid = value;
};

ModelWalkIn.getDesc = function () {
  return this.desc;
};

ModelWalkIn.setDesc = function (value) {
  this.desc = value;
};

ModelWalkIn.getColour = function (value) {
  return this.colour;
};

ModelWalkIn.setColour = function (value) {
  this.colour = value;
};

ModelWalkIn.getFields = function () {
  return this.fields;
};
ModelWalkIn.setFields = function (value) {
  return this.value;
};

ModelWalkIn.reset = function () {
  this.sid = "";
  this.desc = "";
  this.colour = "";
  this.fields = [];
};

ModelWalkIn.resetFields = function () {
  this.fields.forEach((f) => {
    if (f.type === "checkbox") {
      f.setValue(false);
    } else if (f.type === "date" || f.type === "time") {
      f.setValue(new Date().toLocaleString());
    } else {
      f.setValue("");
    }
  });
};

ModelWalkIn.getServiceData = async (sid) => {
  const endpoint = config.api + "/p/servicefields?s=" + sid;
  let apiResponse = await fetch(endpoint, { method: "GET" });
  let Reply = await apiResponse.json();

  if (Reply.success) {
    ModelWalkIn.sid = Reply.result.sid;
    ModelWalkIn.desc = Reply.result.desc;
    ModelWalkIn.colour = Reply.result.colour;
    ModelWalkIn.fields = Reply.result.fields.map((f, index) => {
      const obj = Object.assign({}, ModelWalkInObject);
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

      if (f.type === "checkbox") {
        obj.setValue(false);
      } else if (f.type === "date" || f.type === "time") {
        obj.setValue(new Date().toLocaleString());
      } else {
        obj.setValue("");
      }

      return obj;
    });
  }
};

ModelWalkIn.bookService = async function () {
  let index = 0;
  while (index < this.fields.length) {
    if (this.fields[index].getRequired() && this.fields[index].getEnabled()) {
      if (
        this.fields[index].getType() !== "checkbox" &&
        this.fields[index].getValue() === ""
      ) {
        return {
          success: false,
          severity: 1,
          message: this.fields[index].getDesc() + " is required.",
        };
      }
    }
    index++;
  }

  const data = new URLSearchParams();
  //data.append("desc", this.desc);
  //data.append("colour", this.colour);
  //data.append("time", new Date().getTime());
  //data.append("type", "walk-in");
  //data.append("group", "");
  //data.append("status", "Waiting");
  data.append("service_sid", this.sid);
  data.append("book_type", "walk-in");
  data.append("tutor_id", "");
  data.append("tutor_sid", "");
  data.append("tutor_name", "");
  data.append("start", "");
  data.append("month", "");
  data.append("date", "");
  data.append("day", "");

  const fields = this.fields.map((f) => {
    return {
      code: f.getCode(),
      desc: f.getDesc(),
      type: f.getType(),
      value: f.getValue(),
    };
  });

  data.append("fields", JSON.stringify(fields));

  const endpoint = config.api + "/p/booking";
  let apiResponse = await fetch(endpoint, { method: "POST", body: data });
  let reply = await apiResponse.json();

  if (reply.success) {
    return reply;
  }
  return {
    success: false,
    severity: 2,
    message: "There was an error in booking.",
  };
};
