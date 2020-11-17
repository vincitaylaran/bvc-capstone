///
/// ModelCheckboxes - Serves as a model for form-service.js.
///

import { observable } from "mobx";

/// Model for handling MUI checkboxes.
export const ModelCheckboxes = observable({
  // Pass an object into the array.
  // Object format should be { name: string, checked: bool} format.
  checkboxes: []
});

///
/// Get & Set methods
///

/// Sets an object to the checkbox.
/// Params:
///   @value: The object to be set into the cheboxes array.
///           Should contain {name: string, checked: bool}
ModelCheckboxes.setCheckboxes = function(value) {
  this.checkboxes = value;
};
ModelCheckboxes.getingtCheckboxes = function() {
  return this.checkboxes;
};
ModelCheckboxes.modCheckboxes = function(value) {
  for (let i = 0; i < this.checkboxes.length; i++) {
    if (this.checkboxes[i].name === value) {
      this.checkboxes[i].checked = !this.checkboxes[i].checked;
    }
  }
}
ModelCheckboxes.getCheckboxes = function() {
  let temp =[];
  for (let i = 0; i < this.checkboxes.length; i++) {
    if (this.checkboxes[i].checked) {
      temp.push(this.checkboxes[i].name);
    }
  }
  return temp;
};

/// Returns the checked value of a checkbox.
/// Params:
///   @name: the name of the checkbox.
ModelCheckboxes.getChecked = function(name) {
  for (let i = 0; i < this.checkboxes.length; i++) {
    if (this.checkboxes[i].name === name) {
      return this.checkboxes[i].checked;
    }
  }
};

///
/// Methods
///

/// This method handles checking / unchecking the checkbox for
/// choosing booking type.
/// Params:
///   @value: the name of the checkbox.
ModelCheckboxes.changeCheckboxState = function(value) {
  // Loop through the array of checkboxes. On match, change checked state
  // to opposite.
  for (let i = 0; i < this.checkboxes.length; i++) {
    if (this.checkboxes[i].name === value) {
      this.checkboxes[i].checked = !this.checkboxes[i].checked;
      break;
    }
  }
};

export default ModelCheckboxes;
