const repository = require("../repository/Repository");
const TwitchService = require("./TwitchService");
const StreamerService = require("./StreamerService");
const StreamService = require("./StreamService");
const SessionService = require("./SessionService");
const CleanService = require("./CleanService");
let instance;

class ServiceFactory {
  constructor() {
    if (!instance) {
      // order is important :
      this.cleanService = new CleanService();
      // twitch api must be available first, streamer must be refresh before update stream
      this.twitchService = new TwitchService();
      this.streamerService = new StreamerService();
      this.streamService = new StreamService();
      this.sessionService = new SessionService();
      instance = this;
    }
    return instance;
  }

  async init() {
    for (const service in this) {
      await this[service].init({ repository, services: this });
    }
  }
}

module.exports = new ServiceFactory();
