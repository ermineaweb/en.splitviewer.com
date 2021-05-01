const { MongoClient } = require("mongodb");
const logger = require("../metrics/logger");

let instance = null;
const dbUrl = process.env.MONGO_URL;

class MongoConnection {
  constructor() {
    if (!instance) {
      this._cnx = null;
      this._dbs = [];
      this._collections = [];
      this._uri = dbUrl;
      instance = this;
    }
    return instance;
  }

  async _getConnection({ dbName, collection }) {
    try {
      if (!this._cnx) {
        this._cnx = await MongoClient.connect(this._uri, { useUnifiedTopology: true });
        logger({
          service: "repository",
          tag: "mongo",
          message: `connect database '${dbName}' collection '${collection}'`,
        });
      }
      if (!this._dbs[dbName]) {
        this._dbs[dbName] = await this._cnx.db(dbName);
      }
      if (!this._collections[collection]) {
        this._collections[collection] = await this._dbs[dbName].collection(collection);
      }
      return this._collections[collection];
    } catch (err) {
      logger({ service: "repository", tag: "error", message: err.message });
    }
  }

  async execute({ dbName, collection, request }) {
    try {
      const db = await this._getConnection({ dbName, collection });
      logger({
        service: "repository",
        tag: "mongo",
        message: `request database '${dbName}' collection '${collection}'`,
      });
      return request(db);
    } catch (err) {
      logger({ service: "repository", tag: "error", message: err.message });
    }
  }
}

module.exports = new MongoConnection();
