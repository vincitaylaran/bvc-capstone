import { observable } from "mobx";
import config from "../config.json";
import moment from "moment";
// import axios from "axios";

// Remove this import after creating API for fetching user data.
import users from "../appointments-data";
// const qs = require("querystring");

const ModelUser = observable({
  email: "",
  password: "",
  tutorSid: null,
  tutorId: null,
  tutorName: null,
  currentWeekSchedule: null,
  nextWeekSchedule: null,
  selectedDaySchedule: null,
  currentWeekAppointments: [],
  nextWeekAppointments: [],
  userList: [],
  listOfTime: "",
  day: "",
  user: "",
  startTime: {
    h: ("0" + 5).slice(-2),
    m: ("0" + 0).slice(-2),
  },
  endTime: {
    h: ("0" + 5).slice(-2),
    m: 30,
  },
  findUserString: "",
  paging: {
    page: 1,
    row: 5,
  },
  index: 0,
  display: "",
  oneFetch: [""],
  courses: [],
  waitlists: "",
  courslist: "",
  scheduleStartOfDay: "",
  scheduleEndOfDay: "",
});

/***************************************************
 *  Fetching from the '/schedule/' endpoint *
 ***************************************************/
ModelUser.getScheduleStartOfDay = function () {
  return this.scheduleStartOfDay;
};

ModelUser.setScheduleStartAndEndOfDay = async function (userSid, serviceSid) {
  try {
    const endpoint = `${config.api}/p/user/schedule?service_sid=${serviceSid}&user_sid=${userSid}`;
    const payload = { method: "GET" };
    const reply = await fetch(endpoint, payload);
    const result = await reply.json();

    if (result.success) {
      const startTime = result.result.startTime;
      const endTime = result.result.endTime;

      this.scheduleStartOfDay = startTime;
      this.scheduleEndOfDay = endTime;
    }
  } catch (e) {
    console.error(e);
  }
};

ModelUser.getScheduleEndOfDay = function () {
  return this.scheduleEndOfDay;
};

ModelUser.getSchedule = async function (sid, usersid) {
  try {
    const token = localStorage.getItem(config.authkey);

    const endpoint = `${config.api}/schedule?sid=${sid}&usersid=${usersid}`;

    const payload = {
      method: "GET",
      headers: { Authorization: token },
    };

    const reply = await fetch(endpoint, payload);
    const result = await reply.json();

    this.listOfTime = result.result;

    return result;
  } catch (e) {
    console.error(`From ModelUser.getSchedule --> ${e}`);
  }
};

ModelUser.addToSchedule = async function (
  userSid,
  day,
  startTime,
  endTime,
  services
) {
  try {
    this.courses.forEach((element) => {
      if (element.state) {
        let Service = element.code;
      }
    });
  } catch (e) {
    console.error(`From ModelUser.addToSchedule --> ${e}`);
  }
};

/*************************************
 * Fetching from the '/users' endpoint *
 **************************************/

ModelUser.fetchServiceTutors = async function (serviceSid, day) {
  try {
    const endpoint = `${config.api}/p/users/service_tutors?sid=${serviceSid}&day=${day}`;
    const payload = { method: "GET" };
    const reply = await fetch(endpoint, payload);
    const result = await reply.json();
    return result.result;
  } catch (e) {
    console.error(`ModelUser.fetchServiceTutors error! --> ${e}`);
  }
};

/*****************
 *  Get and Set  *
 *****************/
ModelUser.getTutorId = function () {
  return this.tutorId;
};
ModelUser.getTutorName = function () {
  return this.tutorName;
};
ModelUser.getCurrentWeekSchedule = function () {
  return this.currentWeekSchedule;
};
ModelUser.nextWeekSchedule = function () {
  return this.nextWeekSchedule;
};
ModelUser.getCurrentWeekAppointments = function () {
  return this.currentWeekAppointments;
};
ModelUser.getNextWeekAppointments = function () {
  return this.nextWeekAppointments;
};

/******************
 *    Methods     *
 ******************/
ModelUser.setAppointment = function (appointment) {
  let hasAlreadySetAppointment;

  //
  // Check is the appointment is for the current or next week.
  if (appointment.isCurrentWeek) {
    //
    // Checks if the user has already set an appointment on the same day.
    hasAlreadySetAppointment = this.currentWeekAppointments.find(
      (currentAppointment) => {
        return (
          appointment.email === currentAppointment.email &&
          appointment.month === currentAppointment.month &&
          appointment.date === currentAppointment.date
        );
      }
    );

    if (hasAlreadySetAppointment) {
      console.log("Cannot have more than 1 appointment per day.");
    } else {
      console.log("Appointment successfully ");
      this.currentWeekAppointments.push(appointment);
    }
  } else {
    hasAlreadySetAppointment = this.nextWeekAppointments.find(
      (currentAppointment) => {
        return (
          appointment.email === currentAppointment.email &&
          appointment.month === currentAppointment.month &&
          appointment.date === currentAppointment.date
        );
      }
    );

    if (hasAlreadySetAppointment) {
      console.log("Cannot have more than 1 appointment per day.");
    } else {
      console.log("Appointment successfully ");
      this.nextWeekAppointments.push(appointment);
    }
  }
};

ModelUser.getTutorId = function () {
  return this.tutorId;
};
ModelUser.getTutorName = function () {
  return this.tutorName;
};
ModelUser.getCurrentWeekSchedule = function () {
  return this.currentWeekSchedule;
};
ModelUser.nextWeekSchedule = function () {
  return this.nextWeekSchedule;
};
ModelUser.getCurrentWeekAppointments = function () {
  return this.currentWeekAppointments;
};
ModelUser.getNextWeekAppointments = function () {
  return this.nextWeekAppointments;
};
ModelUser.setUserName = function (value) {
  this.user = value;
};
ModelUser.setStartTime = function (H, M) {
  this.startTime.h = H;
  this.startTime.m = M;
};
ModelUser.setEndTime = function (H, M) {
  this.endTime.h = H;
  this.endTime.m = M;
};
ModelUser.setDay = function (value) {
  this.day = value;
};
ModelUser.getDay = function () {
  return this.day;
};
ModelUser.getStart = function () {
  return this.startTime;
};
ModelUser.getEnd = function () {
  return this.endTime;
};

ModelUser.getListOfTime = function () {
  return this.listOfTime;
};

ModelUser.fetchTutorData = async function (id) {
  try {
    if (id) {
      const tutors = JSON.parse(users);

      tutors.forEach((user) => {
        if (user._id === id) {
          this.tutorId = user._id;
          this.tutorName = user.name;
          this.currentWeekSchedule = user.schedule;
          this.nextWeekSchedule = user.schedule;
        }
      });
    }
  } catch (e) {
    console.error(`Error --> ${e} `);
  }
};

//
// Returns every day of the current week.
ModelUser.getCurrentWeek = function () {
  let currentDate = moment();

  let weekStart = currentDate.clone().startOf("isoWeek");

  const daysOfTheWeek = 7;

  let days = [];

  for (let i = 0; i <= daysOfTheWeek - 1; i++) {
    days.push({
      day: moment(weekStart).add(i, "days").format("dddd"),
      date: moment(weekStart).add(i, "days").format("DD"),
      month: moment(weekStart).add(i, "days").format("MMMM"),
    });
  }

  // this.tutorAvailableDays = days;

  return days;
};

//
// Returns every day of the following week.
ModelUser.getNextWeek = function () {
  let currentDate = moment();

  let weekNext = currentDate.clone().startOf("isoWeek").add(7, "days");
  const daysOfTheWeek = 7;

  let days = [];

  for (let i = 0; i <= daysOfTheWeek - 1; i++) {
    days.push({
      day: moment(weekNext).add(i, "days").format("dddd"),
      date: moment(weekNext).add(i, "days").format("DD"),
      month: moment(weekNext).add(i, "days").format("MMMM"),
    });
  }

  // this.tutorAvailableDays = days;

  return days;
};

//
// Update this method to an async method after creating an API to
// fetch tutor data.
ModelUser.getAvailableDayTimes = function (value) {
  //
  // Searches through the currentWeekSchedule array. Set the 'selectedDaySchedule' property
  // to an object whose 'day' property is equal to whatever was passed to this function's
  // 'value' argument. For example, if 'Monday' was passed as an argument then 'currentWeekSchedule'
  // will have the time schedule for Monday.
  // You must first use the fetchTutorData function for currentWeekSchedule to not be null.
  if (this.currentWeekSchedule) {
    this.currentWeekSchedule.forEach((schedule) => {
      if (schedule.day === value) {
        //
        // ATTENTION! This line should be deleted after creating the backend and the scheduler customier
        // component. The reason is once the tutor sets their schedule, the schedule customizer component
        // will use Moment and its .format method to display the correct output.
        this.selectedDaySchedule = schedule.times.map((time) =>
          //
          // If you don't format each string of the 'selectedDaySchedule' array, each string
          // will remain looking something like this: 2020-02-21T16:00:00.0000Z
          moment(time).format("LT")
        );
      } else if (value === "Saturday" || value === "Sunday") {
        this.selectedDaySchedule = null;
      }
    });
  }
};

ModelUser.firstDayOfMonth = function () {
  let dateObject = this.dateObject;
  let firstDay = moment(dateObject).startOf("month").format("d");

  return firstDay;
};

ModelUser.getUserss = async function () {
  try {
    const token = localStorage.getItem(config.authkey);

    const endpoint = `${config.api}/useress`;

    const payload = {
      method: "GET",
      headers: { Authorization: token },
    };

    const reply = await fetch(endpoint, payload);
    const result = await reply.json();

    this.userList = result.result;

    return result;
  } catch (e) {
    console.error(`From ModelUser.getSchedule --> ${e}`);
  }
};

//ModelUser.getUsers = function () {};

/**************
 * Pagination *
 **************/
ModelUser.setPageNumber = function (value) {
  this.paging.page = this.paging.page + value;
};
ModelUser.getPageNumber = function () {
  return this.paging.page;
};
ModelUser.setPageRow = function (value) {
  if (value === -1) this.paging.row = this.userList.length;
  else this.paging.row = value;
};
ModelUser.getPageRow = function () {
  return this.paging.row;
};
ModelUser.getUsers = function () {
  return this.userList;
};
ModelUser.getfindUser = function () {
  return this.findUserString;
};
ModelUser.setfindUser = function (value) {
  this.findUserString = value;
  let temRow = [];
  this.userList.forEach((element) => {
    if (
      element.nickname
        .toLowerCase()
        .includes(this.findUserString.toLowerCase()) ||
      element.email.toLowerCase().includes(this.findUserString.toLowerCase())
    ) {
      temRow.push(element);
    }
  });
  this.userList = temRow;
};

/////
ModelUser.checkboxStateChanger = function (value) {
  for (let i = 0; i < this.courses.length; i++) {
    this.courses[i].state = false;
    if (this.courses[i].desc === value) {
      this.courses[i].state = !this.courses[i].state;
    }
  }
};

ModelUser.makeCheckboxState = function (value) {
  if (this.courses.length === 0) {
    value.forEach((element) => {
      this.courses.push({
        code: element.sid,
        desc: element.desc,
        colour: element.colour,
        state: false,
      });
    });
  }
};

ModelUser.getCoursesforCheckbox = function () {
  return this.courses;
};

ModelUser.getUserBookings = async function (sid) {};

ModelUser.getSid = async function (firstName, lastName) {
  if (firstName && lastName) {
    const upperCaseFirstName =
      firstName.charAt(0).toUpperCase() + firstName.substring(1);
    const upperCaseLastName =
      lastName.charAt(0).toUpperCase() + lastName.substring(1);

    const endpoint = `${config.api}/p/users/find_by_name?first_name=${upperCaseFirstName}&last_name=${upperCaseLastName}`;
    const payload = { method: "GET" };
    const reply = await fetch(endpoint, payload);
    const result = await reply.json();

    if (result.success) {
      const sid = result.result.sid;
      return sid;
    } else {
      return "";
    }
  }
};

//
// Should pass the ObjectId of the time slot and the user's SID.
ModelUser.removeTimeSlot = async function (_id, userSid) {
  const endpoint = `${config.api}/schedule`;

  const data = new URLSearchParams();
  data.append("token", localStorage.getItem(config.authkey));
  data.append("user_sid", userSid);
  data.append("object_id", _id);

  const payload = { method: "DELETE", body: data };
  const reply = await fetch(endpoint, payload);
  const result = await reply.json();

  if (result.success) {
    const updatedTimeSlotArray = reply.result;
    return updatedTimeSlotArray;
  }

  return [];
};

export { ModelUser };
