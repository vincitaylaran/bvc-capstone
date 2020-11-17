import { observable } from "mobx";
import moment from "moment";
import config from "../config.json";

const ModelAppointment = observable({
  service_sid: null,
  tutor_id: null,
  tutor_sid: null,
  tutorFirstName: null,
  tutorLastName: null,
  month: null,
  date: null,
  day: null,
  startTime: null,
  isCurrentWeek: null,
  availableTutors: [],
  tuteeId: null,
  tuteeName: null,
  tuteeEmail: null,
  tuteePhone: null,
  tuteeNotes: null,
});

ModelAppointment.setAppointment = async function (fields) {
  let index = 0;
  while (index < fields.length) {
    if (fields[index].getRequired() && fields[index].getEnabled()) {
      if (
        fields[index].getType() !== "checkbox" &&
        fields[index].getValue() === ""
      ) {
        return {
          success: false,
          severity: 1,
          message: fields[index].getDesc() + " is required.",
        };
      }
    }
    index++;
  }

  const appointmentFields = fields.map((f) => {
    return {
      code: f.getCode(),
      desc: f.getDesc(),
      type: f.getType(),
      value: f.getValue(),
    };
  });

  /*
  // These fields may not be enabled, we will pull
  //  them in backend instead.
  tutee_id: this.tuteeId,
  tutee_name: this.tuteeName,
  phone: this.tuteePhone,
  email: this.tuteeEmail,
  */

  const appointmentData = {
    service_sid: this.service_sid,
    book_type: "appointment",
    tutor_id: this.tutor_id,
    tutor_sid: this.tutor_sid,
    tutor_name: `${this.tutorFirstName} ${this.tutorLastName}`,
    start: this.startTime,
    month: this.month,
    date: this.date,
    day: this.day,
    fields: JSON.stringify(appointmentFields)
  };
  const endpoint = `${config.api}/p/booking`;
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointmentData),
  };
  const reply = await fetch(endpoint, payload);
  const result = await reply.json();
  return result;
};

ModelAppointment.getTimes = function (
  serviceStartOfDay,
  serviceEndOfDay,
  tutorBookings,
  date
) {
  let items = [];

  //
  // Placeholder values for 'startOfDay' and 'endOfDay'.
  let startOfDay = 0;
  let endOfDay = 10;

  if (serviceStartOfDay && serviceEndOfDay) {
    const startOfDayArray = serviceStartOfDay.split(" ");
    const endOfDayArray = serviceEndOfDay.split(" ");

    // Checks if the first two digits of the time is double digits.
    startOfDay = parseInt(startOfDayArray[0] + startOfDayArray[1]);

    const endOfDay24HourFormat =
      parseInt(endOfDayArray[0] + endOfDayArray[1]) + 12 - startOfDay;

    endOfDay = endOfDay24HourFormat;
  }

  new Array(endOfDay).fill().forEach((acc, index) => {
    items.push({
      startTime: moment({ hour: startOfDay + index }).format("h:mm A"),
      date: date,
      isAvailable: true,
    });
    items.push({
      startTime: moment({ hour: startOfDay + index, minute: 30 }).format(
        "h:mm A"
      ),
      date: date,
      isAvailable: true,
    });
  });

  if (tutorBookings.length > 0) {
    tutorBookings.forEach((booking) => {
      items.forEach((item, index) => {
        if (booking.startTime === item.startTime && booking.date === date) {
          item.isAvailable = false;
        }
      });
    });
  }

  return items;
};

ModelAppointment.getTuteeNotes = function () {
  return this.tuteeNotes;
};

ModelAppointment.setTuteeNotes = function (notes) {
  this.tuteeNotes = notes;
};

ModelAppointment.getAppointmentData = function () {
  return this;
};

ModelAppointment.getIsCurrentWeek = function () {
  return this.isCurrentWeek;
};

ModelAppointment.getStartTime = function () {
  return this.startTime;
};

ModelAppointment.getDay = function () {
  return this.day;
};

ModelAppointment.getDate = function () {
  return this.date;
};

ModelAppointment.getMonth = function () {
  return this.month;
};

ModelAppointment.getTutorFirstName = function () {
  return this.tutorFirstName;
};

ModelAppointment.getTuteeId = function () {
  return this.tuteeId;
};

ModelAppointment.setTuteeId = function (id) {
  this.tuteeId = id;
};

ModelAppointment.setTutorFirstName = function (firstName) {
  this.tutorFirstName = firstName;
};

ModelAppointment.getTutorLastName = function () {
  return this.tutorLastName;
};

ModelAppointment.setTutorLastName = function (lastName) {
  this.tutorLastName = lastName;
};

ModelAppointment.setTuteeName = function (name) {
  this.tuteeName = name;
};

ModelAppointment.getTuteeName = function () {
  return this.tuteeName;
};
ModelAppointment.getTuteeEmail = function () {
  return this.tuteeEmail;
};
ModelAppointment.getTuteePhone = function () {
  return this.tuteePhone;
};
ModelAppointment.setTuteePhone = function (phoneNum) {
  this.tuteePhone = phoneNum;
};
ModelAppointment.getSpecialRequest = function () {
  return this.specialRequest;
};

ModelAppointment.getAvailableTutors = function () {
  return this.availableTutors;
};

ModelAppointment.getTutorSid = function () {
  return this.tutor_sid;
};

ModelAppointment.getAvailableTimes = function () {
  return this.availableTimes;
};

ModelAppointment.getServiceSid = function () {
  return this.service_sid;
};

ModelAppointment.setAvailableTimes = function (value) {
  this.availableTimes = value;
};

ModelAppointment.setTutorSid = function (value) {
  this.tutor_sid = value;
};

ModelAppointment.setAvailableTutors = function (tutorNamesArray) {
  this.availableTutors = tutorNamesArray;
};

ModelAppointment.setSpecialRequest = function (specialRequest) {
  this.tuteeSpecialRequest = specialRequest;
};

ModelAppointment.setMonth = function (month) {
  this.month = month;
};

ModelAppointment.setDate = function (date) {
  this.date = date;
};

ModelAppointment.setDay = function (day) {
  this.day = day;
};

ModelAppointment.setStartTime = function (startTime) {
  this.startTime = startTime;
};

ModelAppointment.setTuteeName = function (name) {
  this.tuteeName = name;
};
ModelAppointment.setTuteeEmail = function (email) {
  this.tuteeEmail = email;
};
ModelAppointment.setTuteePhone = function (phone) {
  this.tuteePhone = phone;
};

ModelAppointment.setIsCurrentWeek = function (isCurrentWeek) {
  this.isCurrentWeek = isCurrentWeek;
};

ModelAppointment.setServiceSid = function (sid) {
  this.service_sid = sid;
};

export { ModelAppointment };
