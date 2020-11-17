import { observable } from "mobx";
import config from "../config.json";

const ModelWaitlist = observable({
  service: null,
  waitlist: { appointments: [], walkins: [] },
});

ModelWaitlist.getWaitlist = async function (services, token) {
  try {
    let endpoint = `${config.api}/bookings?`;
    const arrayLength = services.length - 1;

    services.forEach((service, index) => {
      //
      // The 'services[]' is how you pass an array as a query string.
      // In the '/bookings' endpoint, if you print 'services[0]'
      // it will print the first element on that was passed in the query string.
      if (index === arrayLength) endpoint += `services[]=${service}&`;
      else endpoint += `services[]=${service}&`;
    });
    const reply = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: token },
    });
    const result = await reply.json();
    const waitlist = result.result;

    if (result.success) {
      this.waitlist.appointments = waitlist.filter(
        (booking) => booking.book_type === "appointment"
      );

      this.waitlist.walkins = waitlist.filter(
        (booking) => booking.book_type === "walk-in"
      );
    }

    return this.waitlist;
  } catch (e) {
    console.error(`from ModelWaitlist.test error -> ${e}`);
  }
};

ModelWaitlist.updateStatus = async function (bookType, bookingId) {
  try {
    const token = localStorage.getItem(config.authkey);

    const putData = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    };

    const endpoint = `${config.api}/booking?book_id=${bookingId}`;
    const reply = await fetch(endpoint, putData);
    const result = await reply.json();

    if (result.success) {
      //
      // Updates the object with a matching ID from the observable field 'waitlist' first THEN makes a request to update
      // from the '/booking' endpoint.
      if (bookType === "appointment") {
        this.waitlist.appointments.forEach((booking) => {
          if (booking._id === bookingId) {
            if (booking.status === "waiting") booking.status = "ongoing";
            else booking.status = "waiting";
          }
        });
      }

      if (bookType === "walk-in") {
        this.waitlist.walkins.forEach((booking) => {
          if (booking._id === bookingId) {
            if (booking.status === "waiting") booking.status = "ongoing";
            else booking.status = "waiting";
          }
        });
      }
    }

    return this.waitlist;
  } catch (e) {
    console.error(`ModelWaitlist.updateStatus error --> ${e}`);
  }
};

ModelWaitlist.remove = async function (bookType, bookingId) {
  try {
    const token = localStorage.getItem("asc_authtoken");

    const deleteData = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    };

    const endpoint = `${config.api}/booking?book_id=${bookingId}`;
    const reply = await fetch(endpoint, deleteData);
    const result = await reply.json();

    const isResponseSuccessful = result.success;

    if (isResponseSuccessful) {
      //
      // Removes from the observable field 'waitlist' first THEN makes a request to delete
      // from the '/booking' endpoint.
      if (bookType === "appointment") {
        this.waitlist.appointments.forEach((booking, index) => {
          if (booking._id === bookingId) this.waitlist.splice(index, 1);
        });

        return this.waitlist.appointments;
      }

      if (bookType === "walk-in") {
        this.waitlist.walkins.forEach((booking, index) => {
          if (booking._id === bookingId) this.waitlist.splice(index, 1);
        });

        return this.waitlist.walkins;
      }

      return this.waitlist;
    } else {
      return this.waitlist;
    }
  } catch (e) {
    console.error(`ModelWaitlist.remove error --> ${e}`);
  }
};

export { ModelWaitlist };
