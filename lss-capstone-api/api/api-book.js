const bodyparser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

// Config.
const config = require("../config/config.json");

// Importing Booking model.
const Booking = require("../models/booking.model.js");
const User = require("../models/user.model.js");
const Service = require("../models/service.model");

// Modules
const jwt = require("../modules/token.js");
const mongoconfig = require("../modules/mongo-config.js");
const moment = require("../modules/moment.js");

// Get connection details.
const URI = mongoconfig.getConnectionUri();
const serverError = {success: false,message:"There was an error on the server and the request could not be completed."};

module.exports = function () {
  var api = express.Router();

  api.use(bodyparser.urlencoded({ extended: true }));
  api.use(bodyparser.json());

  //
  // Endpoint for getting all bookings. If you're passing an array of services to the
  // query string of this endpoint, make sure you use 'services'.
  // Example: localhost:54321/bookings?services[]=CTTutor&services[]=Reboot
  //  If I print services[0] it will return 'CTTutor'. If I print services[1] it will return 'Reboot'.
  api.get("/bookings", async (request, response) => {
    try {
      //
      // Assigning the array of services to a variable.
      const services = request.query.services;
      const isQueryStringEmpty = Object.keys(request.query).length === 0;

      const token = request.headers.authorization;

      // Validate token first to save resources.
      if (jwt.isValidToken(token, config.LoginSecret)) {
        // By default, all users has dashboard, we will not check.
        //const userToken = Token.getPayload(token);

        let userBookings = [];

        //
        // Making a connection to the MongoDB Atlas database.
        mongoose.connect(URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        const connection = mongoose.connection;

        //
        // Make a connection to Atlas cluster.
        connection.once("open", function () {
          console.log("MongoDB database connection established successfully.");
        });

        //
        // Check if the endpoint was called with any query strings.
        if (isQueryStringEmpty) {
          //
          // Get all of the bookings in the 'booking' collection.
          userBookings = await Booking.find({});

          const json = resHeader(
            true,
            token,
            "Get was successful.",
            userBookings
          );

          //
          // Returns all bookings.
          response.status(200).send(json);
        } else {
          //
          // Get all of the MATCHING services that were passed as a query string array.
          await Booking.find({}, (err, bookings) => {
            if (err) {
              const json = resHeader(
                false,
                token,
                "User has no services associated to them.",
                []
              );
              response.status(418).send(json);
            } else {
              services.forEach((service) => {
                bookings.forEach((booking) => {
                  if (service === booking.service_sid) {
                    userBookings.push(booking);
                  }
                });
              });

              const json = resHeader(
                true,
                token,
                `Get was successful. User has ${userBookings.length} services associated with them.`,
                userBookings
              );

              response.status(200).send(json);
            }
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  });

  //
  // Returns the start times and end times of a specific user.
  api.get("/p/bookings", async (request, response) => {
    try {
      //
      // Making a connection to the MongoDB Atlas database.
      mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const connection = mongoose.connection;

      //
      // Make a connection to Atlas cluster.
      connection.once("open", function () {
        console.log("MongoDB database connection established successfully.");
      });

      const tutorSid = request.query.tutor_sid;
      const serviceSid = request.query.service_sid;
      let userId = -1; // Placeholder value

      await User.findOne({ sid: tutorSid }, (err, user) => {
        if (err) {
          response
            .status(400)
            .send(JSON.stringify({ success: false, message: "Unknown SID." }));
        } else {
          userId = user._id;
        }
      });

      await Booking.find(
        { tutor_sid: tutorSid, service_sid: serviceSid },
        (err, bookings) => {
          if (err) {
            response.send(JSON.stringify({ success: false, message: err }));
          } else {
            const bookingTimes = bookings.map((booking) => {
              return {
                startTime: booking.start,
                endTime: booking.end,
                date: booking.date,
                day: booking.day,
              };
            });

            response.send(
              JSON.stringify({ success: true, result: bookingTimes })
            );
          }
        }
      );
    } catch (e) {
      console.error(e);
    }
  });

  /**
   * The rest of methods (POST, PUT and DELETE) should have all the information enclosed in the message body in the JSON format.
   **/

  //
  // Endpoint for creating a booking.
  // TODO: update this endpoint after scheduler component is functional. Check for valid JWT.
  api.post("/p/booking", function (request, response) {
    (async function () {
      try {
        //
        // Making a connection to the MongoDB Atlas database.
        mongoose.connect(URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        const connection = mongoose.connection;

        //
        // Make a connection to Atlas cluster.
        connection.once("open", function () {
          console.log("MongoDB database connection established successfully.");
        });

        //
        // Create payload.
        
        // Service details
        const service_sid = request.body.service_sid;
        const book_type = request.body.book_type;

        //Tutor details
        const tutor_sid = request.body.tutor_sid;
        const tutor_name = request.body.tutor_name;
        
        // Booking details
        // The mongoose.Types.ObjectId() generates a mongoDB object ID.
        const _id = new mongoose.Types.ObjectId();
        let start = request.body.start;
        let date = request.body.date;
        let month = request.body.month;
        let day = request.body.day;
        // Since this api endpoint is for booking, we can hardcode this.
        const status = "waiting"; 

        // For walk-in, date values are current date.
        const dateNow = new Date();
        if (book_type.replace("-","") === "walkin") {
          date = dateNow.getDate();
          month = moment.getMonthName(dateNow);
          start = moment.getClockTime(dateNow);
          day = moment.getDayName(dateNow);
        }
        // Millis when booking status was change (created).
        const status_time = dateNow.getTime(); 
        const book_time = dateNow.getTime(); 
        
        // Dynamic fields
        const fields = (request.body.fields
          ? JSON.parse(request.body.fields)
          : []);

        // Tutee details
        const tutee_name = fields.find(f => {return f.code === "Name"}).value;
        const email = fields.find(f => {return f.code === "Email"}).value;
        const tuteeId = fields.find(f => {return f.code === "ID"}).value;
        const phone = fields.find(f => {return f.code === "Phone"}).value;
        const notes = fields.find(f => {return f.code === "Notes"}).value;
        
        let tutor_id;
        if (tutor_sid.trim()) {
          const tutor = await User.findOne({ sid: tutor_sid }, (err, user) => {
            if (err) {
              response.send({ success: false, message: err });
            }
          });
          tutor_id = tutor._id;
        }

        //
        // Create a new book object.
        const book = new Booking({
          _id: _id,
          service_sid: service_sid,
          tutor_sid: tutor_sid,
          tutor_name: tutor_name,
          tutee_id: tuteeId,
          book_type: book_type,
          tutee_name: tutee_name,
          phone: phone,
          email: email,
          start: start,
          status: status,
          notes: notes,
          date: `${month} ${date}`,
          day: day,
          status_time: status_time,
          book_time: book_time,
          fields: fields
        });

        //
        // Insert the request body to the 'bookings' collection. If you look at the schema
        // for 'Book' the default collection is 'bookings'.
        await book.save();

        /*
        // JWT retrieved from query string here!
        const token = null;
        const uri = `${config.ServiceRoot}/booking`;
        */

        //
        // This doesnt include jwt for now.
        const json = {
          success: true,
          message: "Booking successful",
        };

        //
        // A server response of 200 means that the POST request was successful.
        response.status(200).send(JSON.stringify(json));
      } catch (error) {
        console.error("Error in booking", error);
        response.status(200).send(JSON.stringify(serverError));
      }
    })();
  });

  //
  // Endpoint for deleting a booking.
  api.delete("/booking", async (request, response) => {
    try {
      //
      // Store the 'book_id' value in the query string to a variable.
      const bookingId = request.query.book_id;
      //
      // Store the 'token' value in the request body to a variable.
      const token = request.body.token;

      if (jwt.isValidToken(token, config.LoginSecret)) {
        //
        // Making a connection to the MongoDB Atlas database.
        mongoose.connect(URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        const connection = mongoose.connection;

        //
        // Make a connection to Atlas cluster.
        connection.once("open", function () {
          console.log("MongoDB database connection established successfully.");
        });

        await Booking.findOneAndDelete(
          { _id: bookingId },
          { useFindAndModify: false }, // <-- to keep or not to keep? Tis' the question...
          (err, booking) => {
            if (err) {
              const json = resHeader(
                false,
                token,
                "The booking ID provided could not be found."
              );

              response.status(404).send(json);
            } else {
              const json = resHeader(
                true,
                token,
                "Delete was successful",
                booking
              );

              response.status(200).send(json);
            }
          }
        );
      } else {
        const json = resHeader(false, token, "Access Denied");

        response.status(401).send(json);
      }
    } catch (e) {
      console.error(e);
    }
  });

  //
  // Endpoint for updating a tutee's status from 'waiting' to 'ongoing' and vice versa.
  api.put("/booking", async (request, response) => {
    try {
      //
      // Assign the query string 'book_id' to a variable.
      const bookId = request.query.book_id;
      const booking = await Booking.findById(bookId);

      const isOngoing = booking.status === "waiting" ? "ongoing" : "waiting";
      const token = request.body.token;

      if (jwt.isValidToken(token, config.LoginSecret)) {
        //
        // Making a connection to the MongoDB Atlas database.
        mongoose.connect(URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        const connection = mongoose.connection;

        //
        // Make a connection to Atlas cluster.
        connection.once("open", function () {
          console.log("MongoDB database connection established successfully.");
        });

        //
        // Find a document with a matching ID, if the status of the booking is 'ongoing'
        // change it to 'waiting' (vice versa).
        await Booking.findByIdAndUpdate(
          bookId,
          { status: isOngoing },
          (err, booking) => {
            if (err) {
              const json = resHeader(
                false,
                token,
                "There are no bookings with that ID."
              );

              response.status(404).send(json);
            } else {
              const json = resHeader(
                true,
                token,
                "Status update was succesful",
                booking
              );

              response.status(200).send(json);
            }
          }
        );
      } else {
        const json = resHeader(false, token, "Invalid token.");
        response.status(401).send(json);
      }
    } catch (e) {
      console.error(e);
    }
  });

  
  // Endpoint for making a booking.
  api.post("/booking/create");
  
  api.get("/p/servicefields", function (request, response) {
    (async function () {
      try {
        // Look from code from services table.
        const sid = request.query.s;
      
        if (sid) {
          
          // Establish database connection.
          mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          });

          const lssService = await Service
            .findOne({ sid: sid })
            .select("sid desc colour fields -_id");

          const json = {
            success: true,
            message: "success",
            result: lssService
          };
  
          response.status(200).send(JSON.stringify(json));
        } else {
          const json = {
            success: false,
            message: "Invalid parameters.",
          };
  
          response.status(200).send(JSON.stringify(json));
        }
      }
      catch(err) {
        console.error("Error getting service fields (p)", err);
        response.status(401).send(serverError);
      }
    })();
  });

  return api;
};

//
// For creating an object send to back to the client. Uses ES6 syntax.
function resHeader(success, token, message, result = "") {
  return JSON.stringify({ success, token, message, result });
}
