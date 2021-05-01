require("dotenv").config();
const express = require("express");
const path = require("path");
const services = require("./services/ServiceFactory");
const webhook = require("./router/webhook");
const api = require("./router/api");
const logger = require("./metrics/logger");
const cors = require("cors");

(async function () {
  // - get access token
  // - update streamers list in database
  // - update subscriptions event
  try {
    await services.init();
  } catch (err) {
    logger({ service: "service", tag: "error", message: err.message });
  }
})();

// server for webhook
if (process.env.NODE_ENV === "prod") {
  const webhookPort = 80;
  const webhookApp = express();
  webhookApp.use(express.json());
  // when event proc, start to save streamer's viewers
  webhookApp.use("/webhooks", webhook);
  webhookApp.listen(webhookPort, () => {
    logger({ service: "server webhook", tag: "express", message: `listen on port ${webhookPort}` });
  });
}

// server for api
const apiPort = 5000;
const apiApp = express();
if (process.env.NODE_ENV !== "prod") apiApp.use(cors());
// images
apiApp.use("/images", express.static(path.resolve(process.cwd(), "img")));
apiApp.use("/api", api);
apiApp.listen(apiPort, () => {
  logger({ service: "server api", tag: "express", message: `listen on port ${apiPort}` });
});
