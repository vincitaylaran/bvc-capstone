const bodyparser = require("body-parser");
const express = require("express");
const config = require("../config/config.json");
const mongoose = require("mongoose");

//
// Schemas
const User = require("../models/user.model");
const Availability = require("../models/availability.model");
const Role = require("../models/role.model");

// Modules
const jwt = require("../modules/token.js");
const Token = require("../modules/token");
const SidGenerator = require("../modules/sid-generator.js");
const MongoConfig = require("../modules/mongo-config");

const URI = MongoConfig.getConnectionUri();
const serverError = {success: false,message:"There was an error on the server and the request could not be completed."};

module.exports = function () {
  var api = express.Router();
  api.use(bodyparser.urlencoded({ extended: false }));
  api.use(bodyparser.json()); // <-- Needed for getting the request body where the header "Content-Type" is "application/json".

  // Endpoint for inviting users.
  api.post("/user", function (request, response) {
    (async function () {
      try {
        const email = request.body.email;
        const roles = JSON.parse(request.body.roles);
        const token = request.body.token;
        const url = request.body.url;

        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);

          // verify if user has authorization
          if (userToken.prv.includes("usr")) {
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });
      
            const connection = mongoose.connection;
      
            // Make a connection to Atlas cluster.
            connection.once("open", function() {
              console.log("MongoDB database connection established successfully.");
            });

            let error = null;
            const lssUser = await User.findOne({email : email}, function(err, u) {
              if (err) {
                error = err;
              }
            });

            if (error) {
              response.status(500).send(JSON.stringify(serverError));
            }
            else {
              if (lssUser) {
                const json = {
                  success: false,
                  message: "User already in the system.",
                };
                response.status(200).send(JSON.stringify(json));
              } 
              else {

                const rolecodes = roles.map(r => {return r.code;});
                const userroles = await Role.find({code: { $in: rolecodes }}).select("_id");
                const roleids = userroles.map(r => {return r._id;});

                const linkPayload = {
                  iat: new Date().getTime(),
                  sub: email,
                };

                const linkToken = jwt.createToken(
                  linkPayload,
                  config.InviteSecret
                );
                const linkIntive = url + "/invite/" + linkToken;
                const sid = SidGenerator.userSid(email);

                // TODO: CHANGE SID LATER
                const newUser = new User({
                  _id: mongoose.Types.ObjectId(),
                  sid: sid,
                  email: email,
                  password: linkToken,
                  firstname: "",
                  lastname: "",
                  nickname: "",
                  status: "invite " + linkIntive,
                  roles: roleids,
                  schedule: [],
                });

                let error = null;
                newUser.save((err, u) => {
                  if (err) {
                    console.error("Error in saving new user", err);
                    response.status(500).send(JSON.stringify(serverError));
                    error = err;
                  }
                });

                if (!error) {

                  // If there is a configured email service, use that service.
                  if (config.EmailSerivce) {
                    // In the future, if there are different email services, add handling here.
                    //  CREATE A MODULE FOR EACH EMAIL SERVICE.
                  }
                  // Else, create a link for manual sending.
                  else {
                    const json = {
                      success: true,
                      message: "User added to successfully.",
                      emailSent: false,
                      emailSubject: "[no-reply] Invitation from LSS/ASC",
                      emailBody: encodeURI(
                        "You are invited to join LSS/ACS. " +
                          "Please visit the link provided for confirmation. \n\n" +
                          linkIntive +
                          "\n\nThank you!"
                      ),
                    };

                    response.status(200).send(JSON.stringify(json));
                  }
                }
              }
            }
          } else {
            const json = {
              success: false,
              message: "Access Denied.",
            };
            response.status(200).send(JSON.stringify(json));
          }
        } else {
          const json = {
            success: false,
            message: "Access Denied.",
          };
          response.status(200).send(JSON.stringify(json));
        }
      } catch (ex) {
        console.error("Error in invite user", ex);
        response.status(500).send(JSON.stringify(serverError));
      }
    })();
  });

  // Endpoint for inviting users.
  api.put("/user_roles", function (request, response) {
    (async function () {
      try {
        const sid = request.body.sid;
        const roles = JSON.parse(request.body.roles);
        const token = request.body.token;

        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);

          // verify if user has authorization
          if (userToken.prv.includes("usr")) {
            
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });
      
            const connection = mongoose.connection;
      
            // Make a connection to Atlas cluster.
            connection.once("open", function() {
              console.log("MongoDB database connection established successfully.");
            });

            
            const rolecodes = roles.map(r => {return r.code;});
            const userroles = await Role.find({code: { $in: rolecodes }}).select("_id");
            const roleids = userroles.map(r => {return r._id;});

            await User.updateOne(
              { sid: sid },
              { $set: 
                { roles: roleids }
              },
              function(err, u){
                if (err) {
                  console.error("Error in saving new user", err);
                  response.status(500).send(JSON.stringify(serverError));
                }
                else {
                  const json = {
                    success: true,
                    message: "User updated.",
                  };
                  response.status(200).send(JSON.stringify(json));
                }
              }
            );

          } else {
            const json = {
              success: false,
              message: "Access Denied.",
            };
            response.status(200).send(JSON.stringify(json));
          }
        } else {
          const json = {
            success: false,
            message: "Access Denied.",
          };
          response.status(200).send(JSON.stringify(json));
        }
      } catch (ex) {
        console.error("Error in update user roles.", ex);
        response.status(500).send(JSON.stringify(serverError));
      }
    })();
  });

  // Endpoint for user.
  api.get("/user", function (request, response) {
    (async function () {
      try {
        // Look from code from services' table.
        const token = request.headers.authorization;
        const sid = request.query.sid;

        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);
          
          // verify if user has authorization
          if (userToken.prv.includes("usr")) {
            
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

            let error = null;
            const lssUser = await User.findOne({ sid : sid}, (err, user) => {
              if (err) {
                console.error("Error retrieving user", err);
                error = err;
              }
            }).select("-_id");

            if (error) {
              console.error("Error retrieving a user.", err);
              response.status(500).send(JSON.stringify(serverError));
            }
            else {
              if (lssUser) {
                const userroles = await Role.find({_id: { $in: lssUser.roles }}).select("-_id code");
                const rolecodes = userroles.map(r => {return r.code;});

                const returnUser = {
                  sid : lssUser.sid,
                  email :lssUser.email,
                  fname : lssUser.firstname,
                  lname : lssUser.lastname,
                  nname : lssUser.nickname,
                  status : lssUser.status,
                  roles: rolecodes
                }

                const json = {
                  success: true,
                  message: "Success",
                  result: returnUser
                };
                response.status(200).send(JSON.stringify(json));
              }
              else {
                const json = {
                  success: false,
                  message: "Resource not found.",
                };
                response.status(403).send(JSON.stringify(json));
              }
            }

          }
          else {
            const json = {
              success: false,
              message: "Access Denied.",
            };
            response.status(200).send(JSON.stringify(json));
          }
        }
        else {
          const json = {
            success: false,
            message: "Access Denied.",
          };
          response.status(200).send(JSON.stringify(json));
        }
      }
      catch(err) {
        console.error("Error retrieving a user.", err);
        response.status(500).send(JSON.stringify(serverError));
      }
    })();
  });

  api.put("/profile", function (request, response) {
    (async function () {
      try {
        const email = request.body.email;
        const fname = request.body.fname;
        const lname = request.body.lname;
        const nname = request.body.nname;
        const token = request.body.token;

        // Validate token.
        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);

          await User.updateOne(
            { sid : userToken.sid },
            {
              email : email,
              firstname : fname,
              lastname : lname,
              nickname : nname
            },
            function(err, user) {
              if (err) {
                response.status(500).send(JSON.stringify(serverError));
              }
              else {
                
                //Update token
                userToken.sub = email;
                userToken.fna = fname;
                userToken.lna = lname;
                userToken.ali = nname;
                userToken.iat = new Date().getTime();

                const newToken = jwt.createToken(userToken, config.LoginSecret);

                const json = {
                  success: true,
                  message: "Profile updated.",
                  token: newToken,
                };

                response.status(200).send(JSON.stringify(json));
              }
            }
          );
        } else {
          const json = {
            success: false,
            message: "Access Denied.",
          };
          response.status(200).send(JSON.stringify(json));
        }
      } catch (error) {
        console.error(error);

        const json = {
          success: false,
          message:
            "There was an error on the server and the request could not be completed.",
        };

        response.status(500).send(JSON.stringify(json));
      }
    })();
  });

  // Endpoint for getting a user's schedule.
  api.get("/schedule", async (request, response) => {
    try {
      const token = request.headers.authorization;
      const sid = request.query.sid;
      const userSid = request.query.usersid;

      // Validate token first!
      if (jwt.isValidToken(token, config.LoginSecret)) {
        const userToken = jwt.getPayload(token);

        // Next check if user privilege "adm" (admin).
        if (userToken.prv.includes("adm") || sid === userSid) {
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

          let user = await User.findOne({ sid: sid });

          response.status(200).send(
            JSON.stringify({
              success: true,
              message: "User with that SID exists.",
              result: user.schedule,
            })
          );
        } else {
          response
            .status(403)
            .send(
              JSON.stringify({ success: false, message: "Access Denied." })
            );
        }
      } else {
        response
          .status(403)
          .send(JSON.stringify({ success: false, message: "Access Denied." }));
      }
    } catch (e) {
      console.error("Get user schedule", e);

      response.status(500).send(
        JSON.stringify({
          success: false,
          message: "There was a problem with the server.",
        })
      );
    }
  });

  // Endpoint for creating a user's schedule.
  api.post("/schedule", async (request, response) => {
    try {
      //
      // Get user's schedule data from request body and store each value to their respective variables.
      const userSid = request.body.userSid;
      const service = request.body.Service;
      const startTime = request.body.startTime;
      const endTime = request.body.endTime;
      const day = request.body.day;
      //
      // Get token from request body
      const token = request.body.token;

      //
      // Check if the token from the request body is valid.
      if (Token.isValidToken(token, config.LoginSecret)) {
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

        let user = await User.findOne({ sid: userSid }, (err) => {
          if (err)
            response.status(404).send(
              JSON.stringify({
                success: false,
                message: "Could not find a user with that ID.",
              })
            );
        });
        
        const serviceSchedules = {
          service_sid: service,
          _id: mongoose.Types.ObjectId(),
          startTime: startTime,
          endTime: endTime,
          day: day,
        };

        //
        // No need to create a new Availability object. As long as the object to be added to the user's schedule
        // matches EXACTLY the schema that is declared in this 'availability.model.js' file then it's fine.
        user.schedule.push(serviceSchedules);

        //
        // The 'User' instance must call the 'save' method for their new availability to be saved.
        user.save((e) => {
          if (e)
            response.status(400).send(
              JSON.stringify({
                success: false,
                message:
                  "Could not save the object. Make sure you've included all required fields",
              })
            );
          else
            response.status(200).send(
              JSON.stringify({
                success: true,
                message: "Adding to user's schedule was successful",
              })
            );
        });
      } else {
        response.status(200).send(
          JSON.stringify({
            success: false,
            message: "Access Denied",
          })
        );
      }
    } catch (e) {
      console.error("Save user schedule", e);

      response.status(500).send(
        JSON.stringify({
          success: false,
          message: "There was a problem with the server.",
        })
      );
    }
  });

  // Endpoint for removing a user's availability in their schedule.
  api.delete("/schedule", async (request, response) => {
    try {
      const token = request.body.token;
      const userSid = request.query.user_sid;
      const _id = request.query.object_id;

      if (Token.isValidToken(token, config.LoginSecret)) {
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

        await User.findOne({ sid: userSid }, (err, user) => {
          if (err) {
            response.send({
              success: false,
              message: "There are no users with that SID.",
            });
          } else {
            const filteredSchedule = user.schedule.filter(
              (availability) => availability._id !== _id
            );
            response.send({ success: true, result: filteredSchedule });
          }
        });
      } else {
        response
          .status(401)
          .send(JSON.stringify({ success: false, message: "Access Denied." }));
      }
    } catch (e) {
      console.error("Delete user schedule", e);

      response.status(500).send(
        JSON.stringify({
          success: false,
          message: "There was a problem with the server.",
        })
      );
    }
  });

  api.get("/useress", async (request, response) => {
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

      const token = request.headers.authorization;

      if (jwt.isValidToken(token, config.LoginSecret)) {
        let user = await User.find({});
        response.status(200).send(
          JSON.stringify({
            success: true,
            message: "Success",
            result: user.map((u) => {
              return {
                sid: u.sid,
                email: u.email,
                firstname: u.firstname,
                lastname: u.lastname,
                nickname: u.nickname,
                status: u.status,
              };
            }),
          })
        );
      } else {
        response
          .status(403)
          .send(JSON.stringify({ success: false, message: "Invalid token." }));
      }
    } catch (e) {
      console.error(e);
    }
  });

  api.get("/p/users/service_tutors", async (request, response) => {
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

      const sid = request.query.sid;
      const day = request.query.day;

      if (sid && day) {
        User.find({}, (err, users) => {
          if (err) {
            response.status(400).send(JSON.stringify({ success: false }));
          } else {
            const serviceTutorNames = [];

            users.forEach((user) => {
              let isAvailableOnDay = user.schedule.some(
                (availability) =>
                  availability.day === day && availability.service_sid === sid
              );

              if (isAvailableOnDay)
                serviceTutorNames.push({
                  firstName: user.firstname,
                  lastName: user.lastname,
                });
            });

            response
              .status(200)
              .send(
                JSON.stringify({ success: true, result: serviceTutorNames })
              );
          }
        });
      } else {
        response.send(
          JSON.stringify({ success: false, message: "Request not valid." })
        );
      }
    } catch (e) {
      console.error(e);
    }
  });

  //
  // Fetches a tutor's times for when they start and end their day.
  api.get("/p/user/schedule", async (request, response) => {
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

      const serviceSid = request.query.service_sid;
      const userSid = request.query.user_sid;

      await User.findOne({ sid: userSid }, (err, user) => {
        if (err) {
          response.send(
            JSON.stringify({
              success: false,
              message: "No user with that SID.",
            })
          );
        } else {
          const schedule = user.schedule;

          const availability = schedule.find(
            (availability) => availability.service_sid === serviceSid
          );

          if (availability) {
            const startTime = availability.startTime;
            const endTime = availability.endTime;

            response.send(
              JSON.stringify({ success: true, result: { startTime, endTime } })
            );
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  });

  //
  // This route does not check for a valid token.
  api.get("/p/users/find_by_name", async (request, response) => {
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

      const firstName = request.query.first_name;
      const lastName = request.query.last_name;

      User.findOne(
        { firstname: firstName, lastname: lastName },
        (err, user) => {
          if (err) {
            response.send(
              JSON.stringify({
                success: false,
                message: "Could not find a user with that name.",
              })
            );
          } else {
            response.send(JSON.stringify({ success: true, result: user }));
          }
        }
      );
    } catch (e) {
      console.error(e);
    }
  });

  return api;
};

//
// For creating an object send to back to the client. Uses ES6 syntax.
function resHeader(success, token, message, result = "") {
  return JSON.stringify({ success, token, message, result });
}
