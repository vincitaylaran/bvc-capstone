const config = require("../config/config.json")

/// This class handles the construction of connection credentials.
module.exports = class MongoConfig {
  static getConnectionUri() {
    // const HOST = config.MongoDbAtlasDatabaseHost
    // const USERNAME = config.MongoDbAtlasUsername
    // const PASSWORD = config.MongoDbAtlasPassword
    // const SERVER = config.MongoDbAtlasDatabaseServer
    // const DB_NAME = config.MongoDbAtlasDatabaseName
    // const QUERY_STRING = config.MongoDbAtlasQueryString

    // return HOST + USERNAME + ":" + PASSWORD + SERVER + DB_NAME + QUERY_STRING

    // return config.MongoConnection
    return process.env.MONGODB_URI
  }
}
