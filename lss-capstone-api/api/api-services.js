const bodyparser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

// Config
const config = require("../config/config.json");

// Models
const Service = require("../models/service.model");
const DefaultField = require("../models/defaultfields.model");

// Modules
const jwt = require("../modules/token.js");
const SidGenerator = require("../modules/sid-generator.js");
const mongoconfig = require("../modules/mongo-config");

// Get connection details.
const URI = mongoconfig.getConnectionUri();
const serverError = {success: false,message:"There was an error on the server and the request could not be completed."};

module.exports = function() {
  var api = express.Router();

  api.use(bodyparser.urlencoded({ extended: false }));
  /// Endpoint for updating a service

  api.put("/service", function(request, response) {
    (async function() {
      try {
        const token = request.body.token;
        const sid = request.body.sid;
        const newsid = request.body.newsid;
        const colour = request.body.colour;
        const desc = request.body.desc;
        const booking_type = JSON.parse(request.body.booking_type);

        // Validate token first!
        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);

          // Next check if user privilege "svc" 
          if (userToken.prv.includes("svc")) {
          
            // And can modify the specified service. We will place it in a
            //  separate if statement because it will return a different message. 
            if (userToken.svc.includes(sid) || userToken.prv.includes("adm")) {

              // Establish database connection.
              mongoose.connect(URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
              });

              const service = await Service.findOne({ sid: newsid });
              if (service && sid !== newsid) {
                const json = {
                  success: false,
                  message: "Service with given Custom URL already exists."
                };
                response.status(200).send(JSON.stringify(json));
              }
              else {
                await Service.updateOne(
                  { sid: sid },
                  { 
                    sid: newsid,
                    desc: desc,
                    colour: colour,
                    booking_type: booking_type
                  },
                  (err, field) => {
                    if (err) {
                      console.error("Error updating service.", err);

                      const json = {
                        success: false,
                        message:
                          "There was an error on the server and the request could not be completed."
                      };
              
                      response.status(500).send(JSON.stringify(json));
                    }
                    else {
                      const json = {
                        success: true,
                        message: "Service successfully updated."
                      };
        
                      response.status(200).send(JSON.stringify(json));
                    }
                  }
                );
              }
            }
            else {
              const json = {
                success: false,
                message: "You are not authorized to modify this service."
              };
              response.status(200).send(JSON.stringify(json));
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
        else {
          const json = {
            success: false,
            message: "Access Denied."
          };

          response.status(200).send(JSON.stringify(json));
        }
      } catch (error) {
        console.error(error);
        response.status(500).send(JSON.stringify(serverError));
      }
    })();
  });

  /// Endpoint for adding a service.
  api.post("/service", function(request, response) {
    (async function() {
      try{
        
        // Look from info in the table.
        const sid = request.body.sid;
        const desc = request.body.desc;
        const colour = request.body.colour;
        const bookingType = JSON.parse(request.body.bookingType);
        const token = request.body.token;

        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);

          // Next check if user privilege "svc" and can modify the service
          if (userToken.prv.includes("svc")) {

            // Establish database connection.
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

            let error = null;
            // Get default fields.
            let fields = await DefaultField.find({}, function(err, fs){
              if (err) {
                console.error("Error retrieving default fields", err);
              }
            }).select("-_id");

            let sidExist = await Service.findOne({sid:sid}, function(err, fs){
              if (err) {
                error = err;
              }
            });

            let descExist = await Service.findOne({desc:desc}, function(err, fs){
              if (err) {
                error = err;
              }
            });

            if (error) {
              response.status(500).send(JSON.stringify(serverError));
            }
            else {
              if (descExist) {
                const json = {
                  success: false,
                  message: "Service name already exists.",
                };
                response.status(200).send(JSON.stringify(json));
              } 
              else if(sidExist){
                const json = {
                  success: false,
                  message: "Service URL already exists.",
                };
                response.status(200).send(JSON.stringify(json));
              }
              else {

                const newService = new Service({
                  _id: mongoose.Types.ObjectId(),
                  sid: sid,
                  desc: desc,
                  colour: colour,
                  booking_type: bookingType,
                  fields: fields
                });

                newService.save((err, s) => {
                  if (err) {
                    console.error("Error creating service", err);
                    
                    const json = {
                      success: false,
                      message:
                        "There was an error on the server and the request could not be completed."
                    };
          
                  response.status(500).send(JSON.stringify(json));
                }
                else {
                  const json = {
                    success: true,
                    message: "Service successfully added."
                  };
      
                  response.status(200).send(JSON.stringify(json));
                }
              });
            }
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
        else {
          const json = {
            success: false,
            message: "Access Denied."
          };

          response.status(200).send(JSON.stringify(json));
        }
      }
      catch(ex) {
        console.error("Error in creating service", ex);
        response.status(500).send(JSON.stringify(serverError));
      }
    })();
  });

  /// Endpoint for getting service details.
  api.get("/service", function(request, response) {
    (async function() {
      try {

        // Look from code from services table.
        const sid = request.query.s;
        const token = request.headers.authorization;

        // Validate token first!
        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);
        
          // Next check if user privilege "svc" and can modify the service
          if (userToken.prv.includes("svc")) {

            // Establish database connection.
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

            // Get default fields.
            let service = await Service.findOne({sid : sid}, function(err, s){
              if (err) {
                const json = {
                  success: false,
                  message:
                    "There was an error on the server and the request could not be completed."
                };
        
                response.status(500).send(JSON.stringify(json));
              }
            }).select("-_id");

            if (service) {
              const json = {
                success: true,
                message: "success",
                result: service
              };

              response.status(200).send(JSON.stringify(json));
            } 
            else {
              const json = {
                success: false,
                message: "Resource not found."
              };

              response.status(403).send(JSON.stringify(json));
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
        else {
          const json = {
            success: false,
            message: "Access Denied."
          };

          response.status(200).send(JSON.stringify(json));
        }
      }
      catch(ex) {
        console.error("Error retrieving a service", ex);
        response.status(500).send(JSON.stringify(serverError));
      }
    })();
  });

  /// Endpoint for getting a list of services.
  api.get("/services", function(request, response) {
    (async function() {
      try {

        const token = request.headers.authorization;

        // Validate token first!
        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);
        
          // Next check if user privilege "svc" and can modify the service
          if (userToken.prv.includes("svc")) {

            // Establish database connection.
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

            const lssServices = await Service.find({}, (err, services) => {
              if (err) {
                console.error("Error retrieving services.", err);
              }
            }).select("-_id sid desc");
            
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
            const json = {
              success: false,
              message: "Access Denied."
            };

            response.status(200).send(JSON.stringify(json));
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

  /// Endpoint for adding a service field.
  api.post("/servicefields", function(request, response) {
    (async function() {
      try {
        const token = request.body.token;
        const sid = request.body.sid;
        const desc = request.body.desc;
        const required = request.body.req === "true";
        const type = request.body.type;
        const length = request.body.len;
        const def = request.body.def === "true";
        const enabled = request.body.enabled === "true";
        const selections = request.body.sel;

        // Validate token first!
        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);
        
          // Next check if user privilege "svc" and can modify the service
          if ((userToken.prv.includes("svc") && userToken.svc.includes(sid)) ||
              userToken.prv.includes("adm")) {
        
            // Establish database connection.
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

            const code = SidGenerator.titleSid(desc);
            const newField = {
              code: code,
              description: desc,
              required: required,
              type: type,
              length: length,
              default: def,
              enabled: enabled,
              selections: selections
            };

            Service.updateOne(
              { sid: sid },
              {
                $push: { fields : newField }
              },
              function(err, f) {
                if (err) {
                  console.error("Error adding field to service.", err);
                  response.status(500).send(JSON.stringify(serverError));
                }
                else {
                  const json = {
                    success: true,
                    message: "Field successfully added."
                  };
      
                  response.status(200).send(JSON.stringify(json));
                }
              }
            );
          } 
          else {
            const json = {
              success: false,
              message: "Access Denied."
            };

            response.status(200).send(JSON.stringify(json));
          }
        } 
        else {
          const json = {
            success: false,
            message: "Access Denied."
          };

          response.status(200).send(JSON.stringify(json));
        }
      } catch (error) {
        console.error(error);
        response.status(500).send(JSON.stringify(serverError));
      }
    })();
  });

  /// Endpoint for adding a service field.
  api.delete("/servicefields", function(request, response) {
    (async function() {
      try {
        const token = request.body.token;
        const sid = request.body.sid;
        const code = request.body.code;

        // Validate token first!
        if (jwt.isValidToken(token, config.LoginSecret)) {
  
          const userToken = jwt.getPayload(token);
          // Next check if user privilege "svc" and can modify the service
          if ((userToken.prv.includes("svc") && userToken.svc.includes(sid)) ||
              userToken.prv.includes("adm")) {
            
            // Establish database connection.
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });
            
            Service.updateOne(
              { sid: sid },
              {
                $pull: { fields : { code: code} }
              },
              function(err, f) {
                if (err) {
                  console.error("Error removing field to service.", err);
                  response.status(500).send(JSON.stringify(serverError));
                }
                else {
                  const json = {
                    success: true,
                    message: "Field successfully removed."
                  };
      
                  response.status(200).send(JSON.stringify(json));
                }
              }
            );
          } 
          else {
            const json = {
              success: false,
              message: "Access Denied."
            };

            response.status(403).send(JSON.stringify(json));
          }
        } 
        else {
          const json = {
            success: false,
            message: "Access Denied."
          };

          response.status(403).send(JSON.stringify(json));
        }
      } catch (error) {
        console.error(error);
        response.status(500).send(JSON.stringify(serverError));
      }
    })();
  });

  /// Endpoint for updating a service field.
  api.put("/servicefields", function(request, response) {
    (async function() {
      try {
        const token = request.body.token;
        const sid = request.body.sid;
        const oldcode = request.body.oldcode;
        const code = request.body.code;
        const desc = request.body.desc;
        const required = request.body.req === "true";
        const type = request.body.type;
        const length = request.body.len;
        const def = request.body.def === "true";
        const enabled = request.body.enabled === "true";
        const selections = request.body.sel;

        // Validate token first!
        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);

          // Next check if user privilege "svc" and can modify the service
          if ((userToken.prv.includes("svc") && userToken.svc.includes(sid)) ||
              userToken.prv.includes("adm")) {
           
            // Establish database connection.
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });
            
            Service.updateOne(
              { sid: sid, "fields.code" : code },
              {
                $set: { 
                  "fields.$.description" : desc,
                  "fields.$.required" : required,
                  "fields.$.type" : type,
                  "fields.$.length" : length,
                  "fields.$.default" : def,
                  "fields.$.enabled" : enabled,
                  "fields.$.selections" : selections
                }
              },
              function(err, f) {
                if (err) {
                  console.error("Error updating field to service.", err);
                  response.status(500).send(JSON.stringify(serverError));
                }
                else {
                  const json = {
                    success: true,
                    message: "Field successfully updated."
                  };
      
                  response.status(200).send(JSON.stringify(json));
                }
              }
            );
          } 
          else {
            const json = {
              success: false,
              message: "Access Denied."
            };
            response.status(200).send(JSON.stringify(json));
          }
        } 
        else {
          const json = {
            success: false,
            message: "Access Denied."
          };

          response.status(200).send(JSON.stringify(json));
        }
      } catch (error) {
        console.error(error);
        response.status(500).send(JSON.stringify(serverError));
      }
    })();
  });

  /// Endpoint for getting all descriptions for the services.
  api.get("/p/service_descriptions", async (request, response) => {
    try {
      
        // Making a connection to the MongoDB Atlas database.
        mongoose.connect(URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });

        const connection = mongoose.connection;

        // Make a connection to Atlas cluster.
        connection.once("open", function() {
          console.log("MongoDB database connection established successfully.");
        });

        const services = await Service.find({}).select("sid desc booking_type -_id");

        if (services.length < 1) {
          response
            .status(200)
            .send(JSON.stringify({ success: true, result: [] }));
        } 
        else {
          const descriptions = services.map(service => {
            return { 
              desc: service.desc, 
              sid: service.sid, 
              booking_type: service.booking_type 
            };
          });
          
          response
            .status(200)
            .send(JSON.stringify({ success: true, result: descriptions }));
        }
      } catch (e) {
          console.error(e);
          response.status(500).send(JSON.stringify(serverError));
      }
    });

    return api;
};
