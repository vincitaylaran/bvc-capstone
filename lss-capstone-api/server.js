const express = require("express");
const path = require("path");
const config = require("./config/config.json");

// Assign port
const port = config.Port;

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});

// Export APIs.
app.use("/", require("./api/api-login.js")());
app.use("/", require("./api/api-users.js")());
app.use("/", require("./api/api-roles.js")());
app.use("/", require("./api/api-services.js")());
app.use("/", require("./api/api-display.js")());
app.use("/", require("./api/api-book.js")());
app.use("/", require("./api/api-administration.js")());
app.use("/", require("./api/api-suggestion.js")());

app.use(function(request, response, next) {
  response.status(404).send({ message: "Resource not found.", success: false });
});

// Listen for requests on port...
app.listen(port, function() {
  console.log("API starting at port " + port + ". REMEMBER TO SANITIZE!!!");
});
