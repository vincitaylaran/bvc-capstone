const bodyparser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

// Config
const config = require("../config/config.json");

// Models
const DefaultField = require("../models/defaultfields.model");

// Modules
const jwt = require("../modules/token.js");
const SidGenerator = require("../modules/sid-generator.js");
const MongoConfig = require("../modules/mongo-config.js");

const URI = MongoConfig.getConnectionUri();

module.exports = function() {
  var api = express.Router();

  api.use(bodyparser.urlencoded({ extended: false }));

  /// Endpoint for adding a default field.
  api.get("/defaultfields", function(request, response) {
    (async function() {
      try {
        const token = request.headers.authorization;

        // Validate token first!
        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);
        
          // Next check if user privilege "adm" (admin).
          if (userToken.prv.includes("adm")) {
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

            let fields = await DefaultField.find({}, function(err, fs){
              if (err) {
                const json = {
                  success: false,
                  message:
                    "There was an error on the server and the request could not be completed."
                };
        
                response.status(500).send(JSON.stringify(json));
              }
              else {
                return fs;
              }
            });

            if (fields) {
              // Check if fields not empty
              if (fields.length <= 0) {
                fields = [];
              }
            }
            else {
              // If null, set to empty.
              fields = [];
            }
              

            const json = {
              success: true,
              message: "",
              result: fields
            };
  
            response.status(200).send(JSON.stringify(json));
          } else {
            const json = {
              success: false,
              message: "Access Denied."
            };

            response.status(200).send(JSON.stringify(json));
          }
        } else {
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

  /// Endpoint for adding a default field.
  api.post("/defaultfields", function(request, response) {
    (async function() {
      try {
        const token = request.body.token;
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
          
          // Next check if user privilege "adm" (admin).
          if (userToken.prv.includes("adm")) {
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });
            
            // Generate code.
            const code = SidGenerator.titleSid(desc);

            // Add token to list of used tokens.
            let saveFeilds = new DefaultField({
              _id: mongoose.Types.ObjectId(),
              code: code,
              description: desc,
              required: required,
              type: type,
              length: length,
              default: def,
              enabled: enabled,
              selections: selections
            });

            await saveFeilds.save((err, t) => {
              if (err)  {
                console.error("Save default field error", err);
                
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
                  message: "Field successfully added."
                };
    
                response.status(200).send(JSON.stringify(json));
              }
            });
            
          } else {
            const json = {
              success: false,
              message: "Access Denied."
            };

            response.status(200).send(JSON.stringify(json));
          }
        } else {
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

  /// Endpoint for adding a default field.
  api.delete("/defaultfields", function(request, response) {
    (async function() {
      try {
        const token = request.body.token;
        const code = request.body.code;

        // Validate token first!
        if (jwt.isValidToken(token, config.LoginSecret)) {
          const userToken = jwt.getPayload(token);

          // Next check if user privilege "adm" (admin)
          if (userToken.prv.includes("adm")) {

            // Connect to database.
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

            // Delete base on field code.
            await DefaultField.deleteOne(
              { code: code },
              (err, field) => {
                if (err) {
                  console.error("Error deleting field.", err);

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
                    message: "Field successfully removed."
                  };
    
                  response.status(200).send(JSON.stringify(json));
                }
              }
            );

          } else {
            const json = {
              success: false,
              message: "Access Denied."
            };

            response.status(403).send(JSON.stringify(json));
          }
        } else {
          const json = {
            success: false,
            message: "Access Denied."
          };

          response.status(403).send(JSON.stringify(json));
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

  /// Endpoint for updating a default field.
  api.put("/defaultfields", function(request, response) {
    (async function() {
      try {
        const token = request.body.token;
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

          // Next check if user privilege "adm"
          if (userToken.prv.includes("adm")) {

            // Connect to database.
            mongoose.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

            // Update based on field code.
            await DefaultField.updateOne(
              { code: code },
              {
                code: code,
                description: desc,
                required: required,
                type: type,
                length: length,
                default: def,
                enabled: enabled,
                selections: selections
              },
              (err, field) => {
                if (err) {
                  console.error("Error updating field.", err);

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
                    message: "Field successfully updated."
                  };
    
                  response.status(200).send(JSON.stringify(json));
                }
              }
            );
          } else {
            const json = {
              success: false,
              message: "Access Denied."
            };

            response.status(200).send(JSON.stringify(json));
          }
        } else {
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
}