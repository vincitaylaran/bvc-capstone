import { observable } from "mobx";
const ModelTutee = observable({
  //   tuteeId: null,
  name: null,
  email: null,
  phone: null,
  appointments: []
});

//
// A tutee can only have one appointment per day. Check for appointments with duplicate month, date, and day.
// Return an error message of some sort indicating that you're not allowed to have more than one appointment
// per day.
ModelTutee.setAppointment = function(appointment) {
  if (this.appointments.length > 0) {
    this.appointments.forEach(currentAppointment => {
      if (
        currentAppointment.month === appointment.month &&
        currentAppointment.date === appointment.date
      ) {
        // This should be in toast.
        console.log("Cannot have more than one appointment per day!");
      } else {
        this.appointments.push(appointment);
      }
    });
  } else {
    this.appointments.push(appointment);
  }
};

// ModelTutee.getTuteeId = function() {
//   return this.tuteeId;
// };

ModelTutee.getAppointments = function() {
  return this.appointments;
};

ModelTutee.getName = function() {
  return this.name;
};

ModelTutee.getEmail = function() {
  return this.email;
};

ModelTutee.getPhone = function() {
  return this.phone;
};

ModelTutee.setName = function(name) {
  this.name = name;
};

// ModelTutee.setTuteeId = function(id) {
//     this.tuteeId = id;
// }

ModelTutee.setEmail = function(email) {
  this.email = email;
};

ModelTutee.setPhone = function(phone) {
  this.phone = phone;
};

export { ModelTutee };
