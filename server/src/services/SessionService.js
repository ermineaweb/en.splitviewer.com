const ServiceManager = require("./ServiceManager");
const { formatSessionDate, commonPropertiesPercent } = require("../utils");
const { CronJob } = require("cron");

const percentMinSessionResult = Number(process.env.PERCENT_MIN_SESSION_RESULT) || 1;

class SessionService extends ServiceManager {
  constructor() {
    super();
    this.dbName = "twitch";
    this.collectionName = "sessions";
  }

  async init(params) {
    super.init(params);
    if (process.env.NODE_ENV === "prod") {
      // 03:02 am every day
      const daily = new CronJob("02 3 * * *", async () => {
        await this.exec("saveDailyResults");
      });
      daily.start();
    }
    if (process.env.NODE_ENV === "dev") {
      await this.exec("saveDailyResults");
    }
  }

  async aggregate(params) {
    const result = await this.repository.aggregate(this.dbName, this.collectionName, params);
    return result || [];
  }

  async getSession(params) {
    const result = await this.repository.getOne(this.dbName, this.collectionName, params);
    return result || { _id: null };
  }

  async getAllSessions(params) {
    const result = await this.repository.getAll(this.dbName, this.collectionName, params);
    return result || [];
  }

  upsert(params) {
    return this.repository.upsert(this.dbName, this.collectionName, params);
  }

  async getLastSession({ id }) {
    const result = await this.exec("aggregate", [
      { $match: { id } },
      { $sort: { date: -1 } },
      { $limit: 1 },
      {
        $project: {
          id: "$id",
          date: "$date",
          daysession: "$daysession",
          description: "$description",
          display_name: "$display_name",
          login: "$login",
          profile_image_url: "$profile_image_url",
          nb_viewers: "$nb_viewers",
          progress_nb_viewers: "$progress_nb_viewers",
          sessions: "$sessions",
          view_count: "$view_count",
        },
      },
    ]);
    return result[0] || { _id: null };
  }

  async globalStats({ daysession }) {
    const result = await this.exec("aggregate", [
      { $match: { daysession } },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$date" } },
          nb_viewers: { $sum: "$nb_viewers" },
          nb_streamers: { $sum: 1 },
        },
      },
    ]);
    return result || [];
  }

  async streamersStats({ count, type }) {
    const numberDays = type === "day" ? 1 : 7;
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const gt = new Date(date.getTime() - numberDays * 24 * 60 * 60 * 1000);
    const result = await this.exec("aggregate", [
      { $match: { date: { $gte: gt } } },
      {
        $group: {
          _id: { id: "$id" },
          id: { $first: "$id" },
          display_name: { $first: "$display_name" },
          login: { $first: "$login" },
          profile_image_url: { $first: "$profile_image_url" },
          nb_viewers: { $sum: "$nb_viewers" },
          progress_nb_viewers: { $sum: "$progress_nb_viewers" },
          nb_sessions: { $sum: 1 },
        },
      },
      { $sort: { nb_viewers: -1 } },
      { $limit: count },
    ]);
    return result || [];
  }

  async graphGlobal({ count, type, percent }) {
    const numberDays = type === "day" ? 1 : 7;
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const gt = new Date(date.getTime() - numberDays * 24 * 60 * 60 * 1000);
    const result = await this.services.sessionService.exec("aggregate", [
      { $match: { date: { $gte: gt }, nb_viewers: { $gte: 300 } } },
      {
        $group: {
          _id: "$id",
          id: { $first: "$id" },
          display_name: { $first: "$display_name" },
          login: { $first: "$login" },
          profile_image_url: { $first: "$profile_image_url" },
          nb_viewers: { $sum: "$nb_viewers" },
          progress_nb_viewers: { $sum: "$progress_nb_viewers" },
          nb_sessions: { $sum: 1 },
          sessions: { $push: "$sessions" },
        },
      },
      {
        $project: {
          id: "$id",
          display_name: "$display_name",
          login: "$login",
          profile_image_url: "$profile_image_url",
          nb_viewers: "$nb_viewers",
          progress_nb_viewers: "$progress_nb_viewers",
          nb_sessions: "$nb_sessions",
          // delete duplicate value
          sessions: { $reduce: { input: "$sessions", initialValue: [], in: { $concatArrays: ["$$value", "$$this"] } } },
        },
      },
      {
        $project: {
          id: "$id",
          display_name: "$display_name",
          login: "$login",
          profile_image_url: "$profile_image_url",
          nb_viewers: "$nb_viewers",
          progress_nb_viewers: "$progress_nb_viewers",
          nb_sessions: "$nb_sessions",
          sessions: {
            $filter: {
              input: "$sessions",
              as: "res",
              cond: {
                // filter on percentage
                $and: [
                  { $gte: ["$$res.percent", percent] },
                ],
              },
            },
          },
        },
      },
      { $sort: { nb_viewers: -1 } },
      { $limit: count },
    ]);
    return result || [];
  }

  async chartStats({ id, type }) {
    const _id = type === "day" ? { $dayOfMonth: "$date" } : { $week: "$date" };
    const result = await this.exec("aggregate", [
      {
        $match: {
          id,
          date: { $gte: new Date(new Date().getTime() - 36 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id,
          date: { $first: "$date" },
          nb_viewers: { $sum: "$nb_viewers" },
          progress_nb_viewers: { $first: "$progress_nb_viewers" },
          nb_sessions: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);
    return result || [];
  }

  async saveDailyResults() {
    const date = new Date();
    const oldDate = new Date();
    if (process.env.NODE_ENV === "prod") {
      date.setDate(date.getDate() - 1);
      oldDate.setDate(oldDate.getDate() - 2);
    }
    if (process.env.NODE_ENV === "dev") {
      oldDate.setDate(oldDate.getDate() - 1);
    }
    const daysession = formatSessionDate(date);

    // get all sessions
    const streamSessions = await this.services.streamService.exec("getAllStream", { query: { daysession } });

    // for each session, calc percents and save results
    for (const session of streamSessions) {
      const nb_viewers = session?.viewers ? session.viewers.length : 0;

      // calculate progression
      // get last session
      const oldSession = await this.exec("getLastSession", { id: session.id });
      const oldNb = oldSession?.nb_viewers;
      const progress_nb_viewers = oldNb ? Math.ceil(((nb_viewers - oldNb) / oldNb) * 100) : 0;

      if (nb_viewers > 500) {
        await this.exec("saveResults", { ...session, streamSessions, nb_viewers, progress_nb_viewers });
      }
    }
  }

  async saveResults(params) {
    const { viewers, streamSessions, id, ...restParams } = params;

    const streamSessionsWithPercents = this.exec("addPercentsToStream", { id, viewers, streamSessions });
    await this.exec("upsert", { ...restParams, id, sessions: streamSessionsWithPercents });
  }

  addPercentsToStream({ id, viewers, streamSessions }) {
    return (
      streamSessions
        // dont want the streamer in results
        .filter((s) => s.id !== id)
        // add percents
        .map((s) => {
          const p = commonPropertiesPercent(viewers, s?.viewers);
          return {
            id: s.id,
            login: s.login,
            display_name: s.display_name,
            profile_image_url: s.profile_image_url,
            percent: p,
          };
        })
        // sort high percent -> low percent
        .sort((a, b) => b.percent - a.percent)
        // take only hights percents
        .filter((s) => s.percent > percentMinSessionResult)
    );
  }
}

module.exports = SessionService;
