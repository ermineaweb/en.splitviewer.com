const express = require("express");
const router = express.Router();
const services = require("../services/ServiceFactory");
const logger = require("../metrics/logger");
const { formatSessionDate } = require("../utils");

router.get("/status", (req, res) => {
  return res.send("api work");
});

// liste des streamers
router.post("/streamers", async (req, res) => {
  logger({ service: "server", tag: "api", message: `streamers` });
  const streamers = await services.streamerService.exec("getAllStreamers");
  return res.json(streamers);
});

// détails d'un streamer
router.post("/streamer/:login", async (req, res) => {
  const login = req.params.login;
  logger({ service: "server", tag: "api", message: `streamer ${login}` });
  const streamer = await services.streamerService.exec("getStreamer", { login });
  return res.json(streamer);
});

// renvoie la dernière session
router.post("/session/:user_id", async (req, res) => {
  const id = req.params.user_id;
  logger({ service: "server", tag: "api", message: `last session ${id}` });
  const result = await services.sessionService.exec("getLastSession", { id });
  return res.json(result);
});

// renvoie toutes les sessions de la veille
router.post("/sessions", async (req, res) => {
  const date = new Date();
  if (process.env.NODE_ENV === "prod") date.setDate(date.getDate() - 1);
  if (process.env.NODE_ENV !== "prod") date.setDate(date.getDate());
  const daysession = formatSessionDate(date);
  logger({ service: "server", tag: "api", message: `all sessions ${daysession}` });
  const result = await services.sessionService.exec("getAllSessions", { daysession });
  return res.json(result);
});

router.post("/graph/all/:type/:percent/:count", async (req, res) => {
  const type = req.params.type;
  const percent = Number(req?.params?.percent);
  const count = Number(req.params.count);
  logger({ service: "server", tag: "api", message: `graph global ${type} ${count}` });
  const result = await services.sessionService.exec("graphGlobal", { percent, count, type });
  return res.json(result);
});

// renvoie un tableau de stats pour les graphiques semaine / jour
router.post("/stats/:type/:user_id", async (req, res) => {
  const id = req.params.user_id;
  const type = req.params.type;
  logger({ service: "server", tag: "api", message: `stats ${type} user ${id}` });
  const result = await services.sessionService.exec("chartStats", { id, type });
  return res.json(result);
});

// toutes les stats pour jour, week, month... pour les streamers page home
router.post("/stats/all/:type/:count", async (req, res) => {
  const type = req.params.type;
  const count = req.params.count > 8 ? 8 : Number(req.params.count);
  logger({ service: "server", tag: "api", message: `stats all streamers ${type}` });
  const result = await services.sessionService.exec("streamersStats", { count, type });
  return res.json(result);
});

// statistiques globales a l'application
router.post("/stats", async (req, res) => {
  const date = new Date();
  if (process.env.NODE_ENV === "prod") date.setDate(date.getDate() - 1);
  if (process.env.NODE_ENV !== "prod") date.setDate(date.getDate());
  const daysession = formatSessionDate(date);
  logger({ service: "server", tag: "api", message: `global stats` });
  const result = await services.sessionService.exec("globalStats", { daysession });
  return res.json(result);
});

// tops clips et clips random
router.post("/clips/:user_id/:random", async (req, res) => {
  const id = req.params?.user_id;
  const random = req.params?.random;
  const count = 5;
  logger({ service: "server", tag: "api", message: `clips ${id}` });
  const result = await services.twitchService.exec(random === "true" ? "getStreamerClipsRandom" : "getStreamerClips", {
    id,
  });
  return res.json(result.slice(0, count));
});

module.exports = router;
