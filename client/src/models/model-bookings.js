import { observable } from "mobx";
import config from "../config.json";

const ModelBookings = observable({
  bookings: [],
});

//
// Should return the start times and end times of a tutor's bookings for a
// service.
ModelBookings.setUserBookings = async function (tutorSid, serviceSid) {
  try {
    const endpoint = `${config.api}/p/bookings?tutor_sid=${tutorSid}&service_sid=${serviceSid}`;
    const payload = { method: "GET" };
    const reply = await fetch(endpoint, payload);
    const result = await reply.json();
    if (result.success) {
      const userBookings = result.result;

      this.bookings = userBookings;
    }
  } catch (e) {
    console.error(`from ModelBookings.getBookings error -> ${e}`);
  }
};

ModelBookings.getUserBookings = function () {
  return this.bookings;
};

export { ModelBookings };
