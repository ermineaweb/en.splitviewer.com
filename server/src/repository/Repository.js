const mongoConnection = require("./MongoConnection");
const { ObjectId } = require("mongodb");
let instance = null;

class Repository {
  constructor(mongoConnection) {
    if (!instance) {
      this.mongoConnection = mongoConnection;
      instance = this;
    }
    return instance;
  }

  async upsert(dbName, collection, { _id, ...fields }) {
    // convert ID to mongoDb ID. If undefined, we get a null mongodb ID
    const idQuery = _id ? { _id: ObjectId(_id).valueOf() } : { _id: new ObjectId() };
    // insert or update data
    const request = (db) => db.updateOne(idQuery, { $set: { ...fields } }, { upsert: true });
    await this.mongoConnection.execute({ dbName, collection, request });
    return true;
  }

  async getAll(dbName, collection, params) {
    const request = (db) =>
      db
        .find({ ...params?.query })
        .sort({ ...params?.sort })
        .toArray();
    return await this.mongoConnection.execute({ dbName, collection, request });
  }

  async getOne(dbName, collection, params) {
    const request = (db) => db.findOne({ ...params });
    return await this.mongoConnection.execute({ dbName, collection, request });
  }

  async aggregate(dbName, collection, params) {
    const request = (db) => db.aggregate(params).toArray();
    return await this.mongoConnection.execute({ dbName, collection, request });
  }

  async updateMany(dbName, collection, params) {
    const request = (db) => db.updateMany({ ...params });
    await this.mongoConnection.execute({ dbName, collection, request });
    return true;
  }

  async delete(dbName, collection, params) {
    const request = (db) => db.deleteOne(params);
    await this.mongoConnection.execute({ dbName, collection, request });
    return true;
  }
}

module.exports = new Repository(mongoConnection);
