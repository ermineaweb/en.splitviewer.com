const ServiceManager = require("./ServiceManager");
const { formatSessionDate } = require("../utils");
const { subTypes } = require("../subTypes");
const { CronJob } = require("cron");

const refreshTimeViewers = Number(process.env.REFRESH_VIEWERS_TIME_MIN) || 1;
const languageStreamerRefresh = process.env.LANGUAGE_STREAMERS_REFRESH || "fr";
const viewersLimit = Number(process.env.VIEWERS_MINI_TO_REFRESH) || 5000;

class StreamService extends ServiceManager {
  constructor() {
    super();
    this.dbName = "twitch";
    this.collectionName = "streams";
    this.refreshTimers = {};
  }

  async init(params) {
    super.init(params);
    if (process.env.NODE_ENV === "prod") {
      // 03:00 am every day
      const job = new CronJob(
        "0 3 * * *",
        async () => {
          await this.exec("updateSubscriptions");
        },
        null,
        false,
        null,
        null,
        true
      );
      job.start();
    }
    if (process.env.NODE_ENV === "dev") {
      await this.exec("updateSubscriptions");
    }
  }

  async getStream(params) {
    const result = await this.repository.getOne(this.dbName, this.collectionName, params);
    return result || { _id: null };
  }

  async getAllStream(params) {
    const result = await this.repository.getAll(this.dbName, this.collectionName, params);
    return result || [];
  }

  upsert(params) {
    return this.repository.upsert(this.dbName, this.collectionName, params);
  }

  async updateSubscriptions() {
    // get all subscriptions from twitch api
    const subscriptions = await this.services.twitchService.exec("getAllSubscriptions");

    // clean subscriptions
    // await this.services.twitchService.exec("cleanSubscriptions", { subscriptions });

    // check if a valid subscription exists for each streamer
    // if subscription event doesn't exist, create one
    if (process.env.NODE_ENV === "prod") {
      const subscriptionsOnline = subscriptions
        .filter((s) => s.type === subTypes.STREAM_ONLINE && s.status === "enabled")
        .map((s) => s.condition?.broadcaster_user_id);

      const subscriptionsOffline = subscriptions
        .filter((s) => s.type === subTypes.STREAM_OFFLINE && s.status === "enabled")
        .map((s) => s.condition?.broadcaster_user_id);

      // get all streamers from database
      const streamers = await this.services.streamerService.exec("getAllStreamers");

      // subsribe to online/offline events for all streamer, if subscriptions does not already exist
      for (const streamer of streamers) {
        if (streamer.id) {
          if (!subscriptionsOnline.includes(streamer.id)) {
            await this.services.twitchService.exec("subscribeToEvent", {
              type: subTypes.STREAM_ONLINE,
              userId: streamer.id,
            });
          }

          if (!subscriptionsOffline.includes(streamer.id)) {
            await this.services.twitchService.exec("subscribeToEvent", {
              type: subTypes.STREAM_OFFLINE,
              userId: streamer.id,
            });
          }
        }
      }
    }
    await this.exec("updateStreamSessionOnlineStreamers");
  }

  async updateStreamSessionOnlineStreamers() {
    // Need that cause webtv may never on/off stream
    // get actuals online streams
    const streamers = await this.services.twitchService.exec("getAllStreams", {
      viewersLimit,
      params: [{ language: languageStreamerRefresh }],
    });

    // start record stream session if they are online
    for (const { user_name, user_id } of streamers) {
      await this.exec("updateStreamSession", { user_name, user_id, run: true });
    }
  }

  async updateStreamSession({ user_id, user_name, run = true }) {
    const streamer = await this.services.streamerService.exec("getStreamer", { id: user_id });

    if (run === true && streamer._id) {
      // get the streamer with updated informations, but we dont want all
      // because we will save that in stream
      const { _id, nb_viewers, total_hours, duration, ...updatedStreamer } = streamer;

      // fetch viewers list
      const viewersUpdated = await this.services.twitchService.exec("getViewers", { user_name });

      if (viewersUpdated && viewersUpdated.length > 0) {
        const date = new Date();
        const daysession = formatSessionDate(date);
        await this.exec("updateViewersTime", { updatedStreamer, date, viewersUpdated, daysession });
      }

      // re execute this method until the offline.event is call
      this.refreshTimers[user_name] = setTimeout(
        async () => await this.exec("updateStreamSession", { user_id, user_name }),
        refreshTimeViewers * 60 * 1000
      );
    } else {
      // offline.event is call, stop call this method
      if (this.refreshTimers[user_name]) clearTimeout(this.refreshTimers[user_name]);
    }
  }

  async updateViewersTime({ updatedStreamer, viewersUpdated, daysession, date }) {
    const { id } = updatedStreamer;
    const streamSession = await this.exec("getStream", { id, daysession });

    const newStreamSession = streamSession._id
      ? streamSession
      : {
          ...updatedStreamer,
          date,
          daysession,
          viewers: [],
        };

    // remove duplicate viewers
    const newViewers = new Set([...newStreamSession.viewers, ...viewersUpdated]);
    // update viewers
    newStreamSession.viewers = [...newViewers];
    await this.exec("upsert", newStreamSession);
  }
}

module.exports = StreamService;
