import moment from "moment";

const users = JSON.stringify([
  {
    _id: 1,
    sid: "admin1",
    sub: "admin.asc@mybvc.ca",
    password: "admin123",
    name: "Asc Admin",
    roles: [1]
  },
  {
    _id: 2,
    sid: "tutor1",
    sub: "tutor.asc@mybvc.ca",
    password: "tutor123",
    name: "Asc Tutor",
    roles: [2],
    schedule: [
      {
        day: "Monday",
        times: [
          moment({ hour: 9, minute: 0 }),
          moment({ hour: 9, minute: 30 }),
          moment({ hour: 10, minute: 0 }),
          moment({ hour: 10, minute: 30 })
        ]
      },
      {
        day: "Tuesday",
        times: [
          moment({ hour: 9, minute: 0 }),
          moment({ hour: 10, minute: 0 }),
          moment({ hour: 10, minute: 30 })
        ]
      },
      {
        day: "Wednesday",
        times: [
          moment({ hour: 9, minute: 0 }),
          moment({ hour: 9, minute: 30 }),
          moment({ hour: 10, minute: 0 }),
          moment({ hour: 10, minute: 30 }),
          moment({ hour: 17, minute: 0 })
        ]
      },
      {
        day: "Thursday",
        times: [
          moment({ hour: 9, minute: 0 }),
          moment({ hour: 9, minute: 30 }),
          moment({ hour: 10, minute: 0 }),
          moment({ hour: 10, minute: 30 })
        ]
      },
      {
        day: "Friday",
        times: [
          moment({ hour: 9, minute: 0 }),
          moment({ hour: 9, minute: 30 }),
          moment({ hour: 10, minute: 0 }),
          moment({ hour: 10, minute: 30 })
        ]
      }
    ]
  }
]);

export default users;
