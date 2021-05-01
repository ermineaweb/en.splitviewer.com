const ServiceManager = require("./ServiceManager");
const axios = require("axios");
const logger = require("../metrics/logger");
const { shuffleArray } = require("../utils");
const { CronJob } = require("cron");

const host = process.env.VIRTUAL_HOST || "localhost";
const pathCallback = process.env.PATH_CALLBACK || "/webhooks/callback";
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const appSecret = process.env.APP_SECRET;

class TwitchService extends ServiceManager {
  constructor() {
    super();
    this.accessToken = null;
    this.subscriptionUrl = "https://api.twitch.tv/helix/eventsub/subscriptions";
    this.headers = null;
  }

  async init(params) {
    super.init(params);
    await this.exec("refreshAccessToken");
    if (process.env.NODE_ENV === "prod") {
      // we need to have a valid access token before doing anything
      // refresh token every month
      const job = new CronJob("0 0 1 * *", async () => await this.exec("refreshAccessToken"));
      job.start();
    }
  }

  async refreshAccessToken() {
    const result = await axios({
      method: "post",
      url: `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    });
    this.accessToken = result?.data?.access_token;
    // refresh headers
    this.headers = {
      Authorization: `Bearer ${this.accessToken}`,
      "Client-ID": clientId,
      "Content-Type": "application/json",
    };
  }

  async getAllSubscriptions(cursor = "", subscriptions = []) {
    const url = cursor ? this.subscriptionUrl + "?after=" + cursor : this.subscriptionUrl;
    try {
      const result = await axios({ method: "get", url, headers: this.headers });
      subscriptions.push(...result?.data?.data);
      if (result.data.pagination.cursor) {
        await this.getAllSubscriptions(result.data.pagination.cursor, subscriptions);
      }
      return subscriptions;
    } catch (err) {
      logger({ service: "service", tag: "error", message: err });
    }
  }

  async getNumberSubscriptions() {
    try {
      const result = await axios({ method: "get", url: this.subscriptionUrl, headers: this.headers });
      return result?.data?.total;
    } catch (err) {
      logger({ service: "service", tag: "error", message: err.message });
    }
  }

  async deleteSubscription({ id }) {
    try {
      await axios({ method: "delete", url: `${this.subscriptionUrl}?id=${id}`, headers: this.headers });
    } catch (err) {
      logger({ service: "service", tag: "error", message: err.message });
    }
  }

  async cleanSubscriptions({ subscriptions }) {
    const subscriptionsToDelete = subscriptions.map((s) => s.id);

    for (const id of subscriptionsToDelete) {
      try {
        await this.exec("deleteSubscription", { id });
      } catch (err) {
        logger({ service: "service", tag: "error", message: err.message });
      }
    }
  }

  async subscribeToEvent({ type, userId }) {
    try {
      await axios({
        method: "post",
        url: this.subscriptionUrl,
        headers: this.headers,
        data: {
          type,
          version: "1",
          condition: { broadcaster_user_id: userId },
          transport: { method: "webhook", callback: `https://${host}${pathCallback}`, secret: appSecret },
        },
      });
    } catch (err) {
      logger({ service: "service", tag: "error", message: err.message });
    }
  }

  /**
   * options : after, before, first, game_id, language, user_id, user_login
   * @param paramsArray
   * @returns {Promise<any>}
   */
  async getAllStreams({ viewersLimit, params }) {
    const url = this.getUrlWithParams("https://api.twitch.tv/helix/streams?", params);
    try {
      const result = await axios({ method: "get", url, headers: this.headers });
      return result?.data?.data?.filter((streamer) => streamer?.viewer_count > viewersLimit);
    } catch (err) {
      logger({ service: "service", tag: "error", message: err.message });
    }
  }

  async getViewers({ user_name }) {
    const url = `https://tmi.twitch.tv/group/user/${user_name.toLowerCase()}/chatters`;
    try {
      const result = await axios({ method: "get", url });
      return result?.data?.chatters?.viewers;
    } catch (err) {
      logger({ service: "service", tag: "error", message: err.message });
    }
  }

  async getUsersByIds(paramsArray) {
    const url = this.getUrlWithParams("https://api.twitch.tv/helix/users?", paramsArray);
    try {
      const result = await axios({ method: "get", url, headers: this.headers });
      return result?.data?.data;
    } catch (err) {
      logger({ service: "service", tag: "error", message: err.message });
    }
  }

  async getStreamerClips({ id }) {
    const url = `https://api.twitch.tv/helix/clips?broadcaster_id=${id}&first=5`;
    try {
      const result = await axios({ method: "get", url, headers: this.headers });
      return result?.data?.data;
    } catch (err) {
      logger({ service: "service", tag: "error", message: err.message });
    }
  }

  async getStreamerClipsRandom({ id }) {
    const url = `https://api.twitch.tv/helix/clips?broadcaster_id=${id}&first=100`;
    try {
      const result = await axios({ method: "get", url, headers: this.headers });
      return shuffleArray(result?.data?.data);
    } catch (err) {
      logger({ service: "service", tag: "error", message: err.message });
    }
  }

  getUrlWithParams(url, paramsArray) {
    const params = [url];
    for (const param of paramsArray) {
      Object.keys(param).forEach((p) => {
        params.push(`${p}=${param[p]}`);
      });
    }
    return params.join("&");
  }
}

module.exports = TwitchService;
