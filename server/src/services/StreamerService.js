const ServiceManager = require("./ServiceManager");
const { CronJob } = require("cron");
const { downloadFile } = require("../utils");

const numberStreamerRefresh = Number(process.env.NUMBER_STREAMERS_REFRESH) || 3;
const viewersLimit = Number(process.env.VIEWERS_MINI_TO_REFRESH) || 5000;
const languageStreamerRefresh = Number(process.env.LANGUAGE_STREAMERS_REFRESH) || "fr";

class StreamerService extends ServiceManager {
  constructor() {
    super();
    this.dbName = "twitch";
    this.collectionName = "streamers";
  }

  async init(params) {
    super.init(params);
    // every 1 hour
    if (process.env.NODE_ENV === "prod") {
      const jobStreamer = new CronJob(
        "5 */1 * * *",
        async () => {
          await this.exec("updateStreamers");
        },
        null,
        false,
        null,
        null,
        true
      );
      jobStreamer.start();
      // every day at 03:01
      const jobImages = new CronJob(
        "1 3 * * *",
        async () => {
          await this.exec("updateImages");
        },
        null,
        false,
        null,
        null,
        true
      );
      jobImages.start();
    }
    if (process.env.NODE_ENV === "dev") {
      await this.exec("updateStreamers");
      await this.exec("updateImages");
    }
  }

  async getStreamer(params) {
    const result = await this.repository.getOne(this.dbName, this.collectionName, params);
    return result || { _id: null };
  }

  // get all streamers from database
  async getAllStreamers(params) {
    const result = await this.repository.getAll(this.dbName, this.collectionName, params);
    return result || [];
  }

  upsert(params) {
    return this.repository.upsert(this.dbName, this.collectionName, params);
  }

  async updateStreamers() {
    // get streamers from database
    const databaseStreamers = await this.exec("getAllStreamers");

    // get streamers from twitch api
    const streamers = await this.services.twitchService.exec("getAllStreams", {
      viewersLimit,
      params: [{ language: languageStreamerRefresh, first: numberStreamerRefresh }],
    });

    // get informations updated for each streamer
    const ids = streamers.map((s) => ({ id: s.user_id }));
    const updatedStreamers = await this.services.twitchService.exec("getUsersByIds", ids);
    // update old list with new informations
    const newStreamers = updatedStreamers.map((streamer) => {
      const newStreamer = databaseStreamers.find((updatedStreamer) => streamer.id === updatedStreamer.id);
      return { ...newStreamer, ...streamer };
    });

    for (const streamer of newStreamers) {
      // save updated streamers in database
      await this.exec("upsert", streamer);
    }
  }

  async updateImages() {
    const streamers = await this.exec("getAllStreamers");
    for (const streamer of streamers) {
      downloadFile(streamer.profile_image_url, `img/${streamer.id}.png`).catch((err) => console.log(err.message));
    }
  }
}

module.exports = StreamerService;
