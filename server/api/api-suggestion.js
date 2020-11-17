const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const api = express.Router(); // does this need to be within the 'module.exports' function?
const Suggestion = require("../models/suggestion.model");

const config = require("../config/config.json");
// get all the suggestions
module.exports = function() {
    api.get("/suggestion", async (request, response) => {
        const USERNAME = config.MongoDbAtlasUsername;
        const PASSWORD = config.MongoDbAtlasPassword;
        const DB_NAME = config.MongoDbAtlasDatabaseName;
        const URI =
            "mongodb+srv://" +
            USERNAME +
            ":" +
            PASSWORD +
            "@lss-cluster-zk9jl.mongodb.net/" +
            DB_NAME +
            "?retryWrites=true&w=majority";

        //
        // Making a connection to the MongoDB Atlas database.
        mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const connection = mongoose.connection;

        connection.once("open", function() {
            console.log("MongoDB database connection established successfully.");
        });

        try {
            const suggestions = await Suggestion.find({});
            response.send(suggestions);
        } catch (e) {
            response.status(500).send(err);
        }
    });

    // get a single suggestion by providing id in the params
    api.get("/suggestion/:id", async (request, response) => {
        const USERNAME = config.MongoDbAtlasUsername;
        const PASSWORD = config.MongoDbAtlasPassword;
        const DB_NAME = config.MongoDbAtlasDatabaseName;
        const URI =
            "mongodb+srv://" +
            USERNAME +
            ":" +
            PASSWORD +
            "@lss-cluster-zk9jl.mongodb.net/" +
            DB_NAME +
            "?retryWrites=true&w=majority";

        //
        // Making a connection to the MongoDB Atlas database.
        mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const connection = mongoose.connection;

        connection.once("open", function() {
            console.log("MongoDB database connection established successfully.");
        });

        try {
            const suggestion = await Suggestion.findById(request.params.id);
            response.send(suggestion);
        } catch (e) {
            response.status(500).send(err);
        }
    });

    // create a suggestion
    api.post("/suggestion", async (request, response) => {
        const USERNAME = "lssDeveloper";
        const PASSWORD = "developer123";
        const DB_NAME = "test";
        const URI =
            "mongodb+srv://" +
            USERNAME +
            ":" +
            PASSWORD +
            "@lss-cluster-zk9jl.mongodb.net/" +
            DB_NAME +
            "?retryWrites=true&w=majority";

        //
        // Making a connection to the MongoDB Atlas database.
        mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const connection = mongoose.connection;

        connection.once("open", function() {
            console.log("MongoDB database connection established successfully.");
        });

        const suggestion = new Suggestion(request.body);

        try {
            await suggestion.save();
            response.send(suggestion);
        } catch (e) {
            response.status(500).send(e);
        }
    });

    //delete a suggestion by uinque id
    api.delete("/suggestion/:id", async (request, response) => {
        const USERNAME = config.MongoDbAtlasUsername;
        const PASSWORD = config.MongoDbAtlasPassword;
        const DB_NAME = config.MongoDbAtlasDatabaseName;
        const URI =
            "mongodb+srv://" +
            USERNAME +
            ":" +
            PASSWORD +
            "@lss-cluster-zk9jl.mongodb.net/" +
            DB_NAME +
            "?retryWrites=true&w=majority";

        //
        // Making a connection to the MongoDB Atlas database.
        mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const connection = mongoose.connection;

        connection.once("open", function() {
            console.log("MongoDB database connection established successfully.");
        });

        Suggestion.findByIdAndDelete(request.params.id)
            .then(sug => response.send(sug))
            .catch(e => response.status(400).send("Error" + e));
    });

    return api;
};
