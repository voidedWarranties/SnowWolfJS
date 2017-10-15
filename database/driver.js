const mongoose = require("mongoose");
const config = require("./../config.json")

module.exports = {
  init: () => {
    mongoose.connect(config.mongodb_url, {
      autoReconnect: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      keepAlive: 120,
      poolSize: 100,
      useMongoClient: true
    });
  },
  getConnection: () => {
    return mongoose.connection;
  }
};
