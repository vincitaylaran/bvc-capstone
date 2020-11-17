import { observable } from "mobx";
// import config from "../config.json";

export const ModelToast = observable({
  level: "", // "warning", "success", or "failure"
  pos: "", // "left", "centre", or "right"
  show: false
});

/******************************
     Get and Set functions
 ******************************/
ModelToast.setLevel = value => {
  ModelToast.level = value;
};
ModelToast.getLevel = value => {
  return ModelToast.level;
};
ModelToast.setPos = value => {
  ModelToast.pos = value;
};
ModelToast.getPos = value => {
  return ModelToast.pos;
};
ModelToast.setDisplay = value => {
  ModelToast.show = value;
};
ModelToast.getDisplay = value => {
  return ModelToast.show;
};

/******************************
     Other functions
 ******************************/

ModelToast.ShowToast = value => {
  ModelToast.show = value;
};
