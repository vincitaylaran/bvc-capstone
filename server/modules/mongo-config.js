const config = require("../config/config")

/// This class handles the construction of connection credentials.
module.exports = class MongoConfig {
  static getConnectionUri() {
    return process.env.MONGODB_URI
  }
}
