const bodyparser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

// Config
const config = require("../config/config.json");

// Modules
const jwt = require("../modules/token.js");
const mongoconfig = require("../modules/mongo-config");

// Models
const Booking = require("../models/booking.model.js");
const Service = require("../models/service.model");

// Get connection details.
const URI = mongoconfig.getConnectionUri();
const serverError = {success: false,message:"There was an error on the server and the request could not be completed."};


module.exports = function() {
  var api = express.Router();

  api.use(bodyparser.urlencoded({ extended: false }));

  /// Endpoint for getting a list of services.
  api.get("/display_services", function(request, response) {
    (async function() {
      try {
        const token = request.headers.authorization;

        // Validate token first!
        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);
        
          mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          });

          // Select all services that are walk-in and 
          //  assigned in token.
          let error = null;
          const lssServices = await Service.find(
            { 
              booking_type: { $all : ["walk-in"] },
              sid : { $in : userToken.svc }
            },
            (err, services) => {
              if (err) {
                console.error("Error retrieving services.", err);
                error = err;
              }
            }
          ).select("-_id sid desc");
          
          if (error == null){
            
            if (lssServices) {
              const json = {
                success: true,
                message: "success",
                result: lssServices
              };
              response.status(200).send(JSON.stringify(json));
            }
            else {
              response.status(500).send(JSON.stringify(serverError));
            }
          }
          else {
            response.status(500).send(JSON.stringify(serverError));
          }
        }
        else {
          const json = {
            success: false,
            message: "Access Denied."
          };

          response.status(200).send(JSON.stringify(json));
        }
      }
      catch(ex) {
        console.error("Error retrieving services", ex);
        response.status(500).send(JSON.stringify(serverError));
      }
    })();
  });

// Endpoint for walkin, getting list for a single service.
api.get("/display_walkin", function(request, response) {
  (async function() {
    
    try {
      // Look from code from services' table.
      const sid = request.query.s;
      const token = request.headers.authorization;
      
      // Validate token first!
      if (jwt.isValidToken(token, config.LoginSecret)) {
        const userToken = jwt.getPayload(token);

        // We need to revise how this thing is fetched. Fetch one
        //  service at a time.
        // Check if token contains service fetched. Else, access denied.

        // Making a connection to the MongoDB Atlas database.
        mongoose.connect(URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        const bookings = await Booking.find({ 
          service_sid : sid, 
          book_type : "walk-in", 
          status : "waiting" 
        }); // Get for bookings that are walk-in and are waiting.

        const service = await Service.findOne({sid : sid});
        // convert booked services into lists

        let returnService = {
          success: true,
          status: "",
          code: service.sid,
          desc: service.desc,
          colour: service.colour,
          schedule: ["",""], // Get this from user
          list : bookings.map((el, index) => {
            if (el.service_sid === sid) {
              return {
                name: el.tutee_name,
                queue: index,
                status: el.status
              }
            }
          })
        };

        response.status(200).send(JSON.stringify(returnService));
        
      }
      else {
        const json = {
          success: false,
          message: "Access Denied"
        };

        response.status(200).send(JSON.stringify(json));
      }
    }
    catch(err) {
      console.error("Error retrieving display list", err);
      response.status(200).send(JSON.stringify(serverError));
    }
  })();
});

  // Endpoint for service.
  api.get("/display", function(request, response) {
    (async function() {
      
      try {
        // Look from code from services' table.
        const services = request.query.s;
        const token = request.headers.authorization;
        
        // Validate token first!
        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);

          // We need to revise how this thing is fetched. Fetch one
          //  service at a time. -> GET /display_walkin
          // Check if token contains service fetched. Else, access denied.

          // Making a connection to the MongoDB Atlas database.
          mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });

          const servicesArray = services.replace(/ /g, "").split(",");
          const bookedServices = await Booking.find({ service_sid : { $in : servicesArray }});
          
          // convert booked services into lists

          let returnArray = [];
          servicesArray.forEach(sid => {
            returnArray.push({
              success: true,
              status: "Temporary status",
              code: sid,
              desc: "Should include service description in booking?",
              schedule: ["Still working on this","Still working on this"],
              list: bookedServices.map((el, index) => {
                if (el.service_sid === sid) {
                  return {
                    name: el.tutee_name,
                    queue: index,
                    status: el.status
                  }
                }
              })
            });
          });

          response.status(200).send(JSON.stringify(returnArray));
          
        }
        else {
          const json = {
            success: false,
            message: "Access Denied"
          };

          response.status(200).send(JSON.stringify(json));
        }
      }
      catch(err) {
        console.error("Error retrieving display list", err);
        response.status(200).send(JSON.stringify(serverError));
      }
    })();
  });

  return api;
};
