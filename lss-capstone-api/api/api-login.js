const bodyparser = require("body-parser");
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const mongoose = require("mongoose");


// Importing User model.
const User = require("../models/user.model");
const Role = require("../models/role.model");
const Service = require("../models/service.model");
const UrlToken = require("../models/urltoken.model");

// Config
const config = require("../config/config.json");

//Modules
const jwt = require("../modules/token.js");
const mongoconfig = require("../modules/mongo-config");

// Get connection details.
const URI = mongoconfig.getConnectionUri();
const serverError = {success: false,message:"There was an error on the server and the request could not be completed."};

module.exports = function() {
  var api = express.Router();

  api.use(bodyparser.urlencoded({ extended: false }));

  //
  // Endpoint for login.
  api.post("/login", function(request, response) {
    (async function() {
      try {
        //
        // Make a connection to Atlas. The second argument is optional. It is just there to get rid of a warning
        // that you receive when you run the server.

        const email = request.body.username.toLowerCase();
        const password = request.body.password;

        mongoose.connect(URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });

        //
        // The 'User' model has a built-in static method called 'find'. If you open the file for User
        // it will not explicitly show a 'find' method. Every Mongoose model has available to it a certain
        // set of static methods; 'find' being one of them :)
        const lssUser = await User.findOne({email : email}, function(err, u) {
          if (err) {
            response.status(200).send(
              JSON.stringify({
                success: false,
                message: "Invalid email/password"
              })
            );
          }
        });

        if (lssUser) {
          if (bcrypt.compareSync(password, lssUser.password)) {
            
            let prv = [];
            let svc = [];

            const userRoles = await Role.find({_id: { $in: lssUser.roles }});
            
            let svcIds = [];

            if (userRoles) {
              userRoles.forEach(userRole => {
                userRole.privileges.forEach(up => {
                  if (!prv.includes(up)) { prv.push(up); }
                });
                
                userRole.services.forEach(us => {
                  if (!svcIds.includes(us)) {svcIds.push(us) ;}
                });
              });

              if (svcIds.includes("*")) {
                svc = await Service.find({}).select("sid -_id");
              }
              else {
                svc = await Service.find({_id: { $in: svcIds }}).select("sid -_id");
              }
            }
            
            const payload = {
              iat: new Date().getTime(),
              sub: lssUser.email,
              sid: lssUser.sid,
              fna: lssUser.firstname,
              lna: lssUser.lastname,
              ali: lssUser.nickname,
              prv: prv,
              svc: svc.map(s=> {return s.sid;}),
            };

            const token = jwt.createToken(payload, config.LoginSecret);

            const json = {
              success: true,
              message: "success",
              token: token
            };

            response.status(200).send(JSON.stringify(json));
            
          } else {
            response.status(200).send(
              JSON.stringify({
                success: false,
                message: "Invalid email/password"
              })
            );
          }
        }
        else {
          response.status(200).send(
            JSON.stringify({
              success: false,
              message: "Invalid email/password"
            })
          );
        }
      } catch (e) {
        console.error("Error if login", e);
        response.status(500).send(JSON.stringify(serverError));
      }
    })();
  });

  // Endpoint for forgot password.
  api.post("/forgot", function(request, response) {
    (async function() {
      try {
        // Look from username and password in users' table.
        const user = request.body.username;
        
        // Establish connection.
        mongoose.connect(URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });

        // Look for lssUser in the database.
        let error = null;
        const lssUser = await User.findOne({email:user.toLowerCase()}, function(err, u) {
          if (err) {
            console.error(err);
            error = err;
          }
        });

        if (error == null) {
          // If lssUser found.
          if (lssUser) {
            // Create token.
            const payload = {
              sub: lssUser.email,
              iat: new Date().getTime()
            };
            const token = jwt.createToken(payload, config.ForgotSecret);

            response.status(200).send(
              JSON.stringify({
                success: true,
                message: "",
                token: token
              })
            );
          } else {
            response.status(200).send(
              JSON.stringify({
                success: false,
                message: "Invalid username."
              })
            );
          }
        }
        else {
          response.status(500).send(JSON.stringify(serverError));
        }
      }
      catch(ex) {
        console.error("Error in forgot password", ex);
        response.status(500).send(JSON.stringify(serverError));
      }
    })();
  });

  // Endpoint for reset password.
  api.post("/reset", function(request, response) {
    (async function() {
      try {
        // Get token and password value.
        const password = request.body.password;
        const token = request.body.token;

        // Validate token.
        const valid = jwt.isValidToken(token, config.ForgotSecret);

        // If token valid, establish connection.
        if (valid) {
          mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          });

          // Check if token already used.
          let found = await UrlToken.findOne({ token: token }, function (err, t){
            if (err) {
              console.error("Token search", err);
            }
          });

          // Check if it is not already used.
          if (found === null) {
            const payload = jwt.getPayload(token);

            // Check if token already expired.
            if (new Date().getTime() < Number(payload.iat) + 600000) {
              
              // Add token to list of used tokens.
              let saveToken = new UrlToken({
                _id: mongoose.Types.ObjectId(),
                token: token,
                iat: (new Date().getTime())
              });

              await saveToken.save((err, t) => {
                if (err)  {
                  console.error("Save reset token error", err);
                }
              });

              // Find user with given email.
              let isUser, lssUser;
              await User.find({}, (err, users) => {
                users.forEach(user => {
                  if (user.email === payload.sub) {
                    isUser = true;
                    lssUser = user;
                  }
                });
              });

              if (isUser) {
                const hash = bcrypt.hashSync(password, config.SaltRounds);

                await User.updateOne(
                  { email: lssUser.email, _id: lssUser._id },
                  { password: hash},
                  (err, user) => {
                    if (err) {
                      response.status(200).send(
                        JSON.stringify({
                          success: false,
                          message: "Error changing password."
                        })
                      );
                    }
                    else {
                      response.status(200).send(
                        JSON.stringify({
                          success: true,
                          message: "Password changed."
                        })
                      );
                    }
                  }
                );
              }
              else {
                response.status(404).send(
                  JSON.stringify({
                    success: false,
                    message: "Resource not found."
                  })
                );
              }
            } else {
              response.status(200).send(
                JSON.stringify({
                  success: false,
                  message: "Link already expired."
                })
              );
            }
          } else {
            response.status(200).send(
              JSON.stringify({
                success: false,
                message: "Invalid link."
              })
            );
          }
        } else {
          response.status(200).send(
            JSON.stringify({
              success: false,
              message: "Invalid link."
            })
          );
        }
      }
      catch(ex) {
        console.error("Error in reset", ex);

        response.status(500).send(
          JSON.stringify({
            success: false,
            message: "There was an error on the server and the request could not be completed."
          })
        );
      }
    })();
  });

  // Endpoint for creating a password.
  api.post("/password", function(request, response) {
    // This is a public url but expects a different kind of token
    (async function() {
      try {
        // Get token and password value.
        const password = request.body.password;
        const token = request.body.token;

        // Validate token.
        const valid = jwt.isValidToken(token, config.InviteSecret);

        // If token valid, establish connection.
        if (valid) {
          mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          });

          // Check if token already used.
          let found = await UrlToken.findOne({ token: token }, function (err, t){
            if (err) {
              console.error("Token search", err);
            }
          });

          // Check if it is not already used.
          if (found === null) {
            const payload = jwt.getPayload(token);

            // Check if token already expired. 3 days.
            if (new Date().getTime() < Number(payload.iat) + 259200000) {
              
              // Add token to list of used tokens.
              let saveToken = new UrlToken({
                _id: mongoose.Types.ObjectId(),
                token: token,
                iat: (new Date().getTime())
              });

              await saveToken.save((err, t) => {
                if (err)  {
                  console.error("Save reset token error", err);
                }
              });

              const hash = bcrypt.hashSync(password, config.SaltRounds);

              await User.updateOne(
                { email: payload.sub },
                { 
                  password: hash,
                  status: "active"
                },
                (err, user) => {
                  if (err) {
                    response.status(200).send(
                      JSON.stringify({
                        success: false,
                        message: "Error changing password."
                      })
                    );
                  }
                  else {
                    response.status(200).send(
                      JSON.stringify({
                        success: true,
                        message: "You have successfully registered. You may now login."
                      })
                    );
                  }
                }
              );
              
            } else {
              response.status(200).send(
                JSON.stringify({
                  success: false,
                  message: "Link already expired."
                })
              );
            }
          } else {
            response.status(200).send(
              JSON.stringify({
                success: false,
                message: "Invalid link."
              })
            );
          }
        }
        else {
          response.status(200).send(
            JSON.stringify({
              success: false,
              message: "Invalid link."
            })
          );
        }
      } catch (error) {
        console.error(error);
        response.status(500).send(JSON.stringify(serverError));
      }  
    })();
  });

  // Endpoint for update password .
  api.put("/password", function(request, response) {
    (async function() {
      try {
        const password = request.body.password;
        const newpassword = request.body.newpassword;
        const confirmpassword = request.body.confirmpassword;
        const token = request.body.token;

        // Check if token is valid.
        if (jwt.isValidToken(token, config.LoginSecret)) {

          const email = jwt.getPayload(token).sub;

          // Check again if passwords are the same.
          if (newpassword === confirmpassword) {
            
            // Connect to database.
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });
    
            //
            // The 'User' model has a built-in static method called 'find'. If you open the file for User
            // it will not explicitly show a 'find' method. Every Mongoose model has available to it a certain
            // set of static methods; 'find' being one of them :)
            const lssUser = await User.findOne({ email: email}, (err, u) => {
              if (err) {
                const json = {
                  success: false,
                  message: "Resource not found."
                };
                response.status(404).send(JSON.stringify(json));
              }
              else {
                return u;
              }
            });

            // We should build it from the keys and other tables but for easier process,
            //      just put it in login.json and find email from there.
            if (lssUser) {
              if (bcrypt.compareSync(password, lssUser.password)) {
                const hash = bcrypt.hashSync(newpassword, config.SaltRounds);
                
                //Change the document if found.
                await User.findByIdAndUpdate(
                  lssUser._id,
                  { password: hash },
                  (err, lssUser) => {
                    if (err) {
                      const json = {
                        success: false,
                        message: "There was an error updating your password.",
                      };
            
                      response.status(404).send(JSON.stringify(json));
                    } 
                    else {
                      const json = {
                        success: true,
                        message: "Password updated.",
                      };
            
                      response.status(200).send(JSON.stringify(json));
                    }
                  }
                );
              }
              else {
                const json = {
                  success: false,
                  message: "Invalid password."
                };
                response.status(404).send(JSON.stringify(json));
              }
            }
            else {
              const json = {
                success: false,
                message: "Resource not found."
              };
              response.status(404).send(JSON.stringify(json));
            }


          }
          else {
            response.status(200).send(
              JSON.stringify({
                success: false,
                message: "New Passwords do not match."
              })
            );
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

        const json = {
          success: false,
          message:
            "There was an error on the server and the request could not be completed."
        };

        response.status(500).send(JSON.stringify(json));
      }  
    })();
  });


  return api;
};
