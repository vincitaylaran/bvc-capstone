const bodyparser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

// Config
const config = require("../config/config.json");

// Models
const Role = require("../models/role.model");
const Service = require("../models/service.model");

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

  // Endpoint.
  api.post("/role", function(request, response) {
    (async function() {
      try {  

        const token = request.body.token;
        const desc = request.body.desc;
        const privs = JSON.parse(request.body.privileges);
        const servs = JSON.parse(request.body.services);

        // Validate token
        if (jwt.isValidToken(token, config.LoginSecret)) {
        
          const userToken = jwt.getPayload(token);
          // Check privilege.
          if (userToken.prv.includes("rol")) {
            // Establish database connection.
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

            let svcArray = [];
            
            if (servs.includes("*")) {
              //svcArray = await services.map(s => { return s._id; });
              svcArray = ["*"];
            }
            else {
              const serviceIds = await Service.find({sid: { $in: servs }}).select("_id");
              svcArray = await serviceIds.map(s => { return s._id; });
            }

            const code = SidGenerator.titleSid(desc);

            const newRole = new Role({
              _id: mongoose.Types.ObjectId(),
              code: code,
              description: desc,
              privileges: privs,
              services: svcArray
            });

            newRole.save((err, r) => {
              if (err) {
                response.status(500).send(JSON.stringify(serverError));
              }
              else {
                const json = {
                  success: true,
                  message: "Role saved."
                };
    
                response.status(200).send(JSON.stringify(json));
              }
            });
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
      catch(error) {
        console.error("Error in create role.", error);
        response.status(500).send(JSON.stringify(serverError));
      }

    })();
  });

  // Endpoint.
  api.put("/role", function(request, response) {
    (async function() {
      try {  

        let token = request.body.token;
        let code = request.body.code;
        let desc = request.body.desc;
        let privs = JSON.parse(request.body.privileges);
        let servs = JSON.parse(request.body.services);

        // Validate token
        if (jwt.isValidToken(token, config.LoginSecret)) {
        
          const userToken = jwt.getPayload(token);
          // Check privilege.
          if (userToken.prv.includes("rol")) {

            // Establish database connection.
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

            let svcArray = [];
            
            if (servs.includes("*")) {
              //svcArray = await services.map(s => { return s._id; });
              svcArray = ["*"];
            }
            else {
              const serviceIds = await Service.find({sid: { $in: servs }}).select("_id");
              svcArray = await serviceIds.map(s => { return s._id; });
            }

            await Role.updateOne(
              { code: code },
              {
                description : desc,
                privileges: privs,
                services: svcArray
              },
              function(err, r) {
                if (err) {
                  console.error("Error updating role.", err);
                  response.status(404).send(JSON.stringify(serverError));
                }
                else {
                  const json = {
                    success: true,
                    message: "Role updated."
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
      }
      catch(error) {
        console.error(error);
        
        const json = {
          success: false,
          message:"There was an error on the server and the request could not be completed."
        };

        response.status(500).send(JSON.stringify(json));
      }

    })();
  });

  // Endpoint for service.
  api.get("/roles", function(request, response) {
    (async function() {
      try {
        // Look from code from services' table.
        const token = request.headers.authorization;

        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);

          // Validate if user has "rol" privilege
          if (userToken.prv.includes("rol")) {

            // Establish database connection.
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

            const roles = await Role.find({}, function(err, rs){
              if (err) {
                console.error("Error retrieving roles", err);
                response.status(200).send(JSON.stringify(serverError));
              }
            }).select("code description -_id");

            if (roles) {
              const json = {
                  success: true,
                  message: "success",
                  result: roles
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
      }
      catch(error) {
        console.error(error);
        response.status(200).send(JSON.stringify(serverError));
      }
    })();
  });

  // Endpoint for service.
  api.get("/role", function(request, response) {
    (async function() {
      try {
        // Look from code from services' table.
        const token = request.headers.authorization;
        const code = request.query.r;

        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);

          // Validate if user has "rol" privilege
          if (userToken.prv.includes("rol")) {
             // Establish database connection.
             mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

            const role = await Role.findOne({ code: code }, function(err, rs){
              if (err) {
                console.error("Error retrieving roles", err);
                response.status(200).send(JSON.stringify(serverError));
              }
            });

            if (role) {
              // Get services.
              let retServices = [];
              if (role.services.includes("*")) {
                retServices = await Service.find({}).select("sid -_id");
                retServices.push({sid: "*"});
              }
              else {
                retServices = await Service.find({_id: { $in: role.services }}).select("sid -_id");
              }

              const obj = JSON.parse(JSON.stringify(role));
              const retRole = {
                code: obj.code,
                description: obj.description,
                privs: obj.privileges,
                servs: retServices.map(s => {return s.sid; })
              };

              const json = {
                success: true,
                message: "Role loaded.",
                result: retRole
              };

              response.status(200).send(JSON.stringify(json));
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
      catch(error) {
        console.error(error);
      }
    })();
  });

  // Endpoint for role privileges.
  api.get("/role_privileges", function(request, response) {
    (async function() {
      try {
        // Look from code from services' table.
        const token = request.headers.authorization;
        const code = request.query.r;

        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);

          // Validate if user has "rol" privilege
          if (userToken.prv.includes("rol")) {
            // Establish database connection.
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

            let error = null;
            const role = await Role.findOne({ code: code }, function(err, rs){
              if (err) {
                console.error("Error retrieving roles", err);
                error = err;
              }
            });

            if (error == null) {
              if (role) {
                let privDesc = [];
                
                role.privileges.includes("adm")
                  privDesc.push("Site Administrator");
                role.privileges.includes("brd")
                  privDesc.push("View dashboard");
                role.privileges.includes("lst")
                  privDesc.push("Display public list");
                role.privileges.includes("rpt")
                  privDesc.push("View analytics");
                role.privileges.includes("svc")
                  privDesc.push("Add/modify services");
                role.privileges.includes("rol")
                  privDesc.push("Add/modify roles");
                role.privileges.includes("usr")
                  privDesc.push("Add/modify users");

                const json = {
                  success: true,
                  message: "Retrieved role privileges.",
                  result: privDesc
                };

                response.status(200).send(JSON.stringify(json));
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
              response.status(404).send(JSON.stringify(serverError));
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
      catch(error) {
        console.error(error);
      }
    })();
  });

  // Endpoint for service.
  api.get("/role_services", function(request, response) {
    (async function() {
      try {
        // Look from code from services' table.
        const token = request.headers.authorization;
        const code = request.query.r;

        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);

          // Validate if user has "rol" privilege
          if (userToken.prv.includes("rol")) {
             // Establish database connection.
             mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

            let error = null;
            const role = await Role.findOne({ code: code }, function(err, rs){
              if (err) {
                console.error("Error retrieving roles", err);
                error = err;
              }
            });

            if (error == null) {
              if (role) {
                // Get services.
                let retServices = [];
                if (role.services.includes("*")) {
                  retServices.push("All Services");
                }
                else {
                  const rolesSvc = await Service.find({_id: { $in: role.services }}).select("desc -_id");
                  retServices = rolesSvc.map(s => { return s.desc; });
                }

                const json = {
                  success: true,
                  message: "Role services retrieved.",
                  result: retServices
                };

                response.status(200).send(JSON.stringify(json));
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
              response.status(404).send(JSON.stringify(serverError));
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
      catch(error) {
        console.error(error);
      }
    })();
  });

  return api;
};


