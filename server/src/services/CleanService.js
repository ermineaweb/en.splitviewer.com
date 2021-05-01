const ServiceManager = require("./ServiceManager");
const { CronJob } = require("cron");

class CleanService extends ServiceManager {
  constructor() {
    super();
    this.dbName = "twitch";
    this.collections = ["streamers", "sessions", "streams"];
  }

  async init(params) {
    super.init(params);
    if (process.env.NODE_ENV === "prod") {
      // 03:10 am every day
      const daily = new CronJob("10 3 * * *", async () => {
        await this.exec("clean");
      });
      daily.start();
    }
    if (process.env.NODE_ENV === "dev") {
      await this.exec("cleanAll");
    }
  }

  async deleteOne({ collection, params }) {
    const result = await this.repository.delete(this.dbName, collection, params);
    return result || { _id: null };
  }

  async aggregate({ collection, params }) {
    const result = await this.repository.aggregate(this.dbName, collection, params);
    return result || [];
  }

  async cleanAll() {
    for (const collection of this.collections) {
      await this.exec("cleanCollection", { collection });
    }
  }

  async cleanCollection({ collection }) {
    const date = new Date();
    const numberDays = 12;
    const lt = new Date(date.getTime() - numberDays * 24 * 60 * 60 * 1000);
    // const cursors = await this.exec("aggregate", { collection, params: [{ $match: { id: null } }] });
    const cursors = await this.exec("aggregate", { collection, params: [{ $match: { date: { $lt: lt } } }] });
    for (const cursor of cursors) {
      await this.exec("deleteOne", {
        collection,
        params: { _id: cursor._id },
      });
    }
  }
}

module.exports = CleanService;
