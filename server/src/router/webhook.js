const express = require("express");
const router = express.Router();
const services = require("../services/ServiceFactory");
const logger = require("../metrics/logger");
const { subTypes } = require("../subTypes");

router.get("/status", async (req, res) => {
  const nbSbscriptions = await services.twitchService.exec("getNumberSubscriptions");
  const streamers = await services.streamerService.exec("getAllStreamers");
  return res.send(`service work, ${nbSbscriptions} actives subscriptions, ${streamers.length} actives streamers`);
});

router.post("/callback", async (req, res, next) => {
  const messageType = req.header("Twitch-Eventsub-Message-Type");
  // TODO verify signature match secret
  const messageSignature = req.header("Twitch-Eventsub-Message-Signature");

  switch (messageType) {
    case "webhook_callback_verification":
      logger({ service: "server", tag: "webhook", message: `callback verification` });
      const challenge = req.body.challenge;
      return res.send(challenge);

    case "revocation":
      logger({ service: "server", tag: "webhook", message: `revocation` });
      break;

    case "notification":
      const { subscription, event } = req.body;
      const { type } = subscription;
      const user_id = event.broadcaster_user_id;
      const user_name = event.broadcaster_user_name;

      logger({ service: "server", tag: "webhook", message: `notification ${type} streamer ${user_name}` });

      if (type === subTypes.STREAM_ONLINE) {
        await services.streamService.exec("updateStreamSession", { user_name, user_id, run: true });
        // await services.streamerService.exec("upsert", { ...streamer, status: "online" });
      }
      if (type === subTypes.STREAM_OFFLINE) {
        await services.streamService.exec("updateStreamSession", { user_name, user_id, run: false });
        // await services.streamerService.exec("upsert", { ...streamer, status: "offline" });
      }

      return res.sendStatus(200);

    default:
      logger({ service: "server", tag: "error", message: "error callback invalid request" });
      return res.sendStatus(404);
  }
});

module.exports = router;
