import React from "react";
import styles from "./cardstreamers.module.css";
import { Link } from "react-router-dom";
import { kFormatter } from "../../utils";
import useStatsStreamers from "../../hooks/useStatsStreamers";
import Fade from "react-reveal/Fade";
import Progress from "../Progress";
import StreamerAvatar from "../StreamerAvatar";

function CardStreamers({ streamers, left, right }) {
  return (
    <Fade style={{ width: "100%", height: "100%" }} left={left} right={right} cascade duration={250}>
      <div className={styles.root}>
        {streamers.map((streamer) => (
          <Link key={streamer.id} to={`/streamer/${streamer.login}`} className={styles.card}>
            <div className={styles.avatar}>
              <StreamerAvatar id={streamer.id} style={{ borderRadius: "100px" }} />
            </div>
            <div style={{ width: "30%" }} className={styles.name}>
              {streamer.display_name}
            </div>
            <div style={{ width: "20%" }}>{kFormatter(streamer.nb_viewers)} viewers</div>
            <div style={{ width: "20%" }} className={styles.progression}>
              <Progress number={streamer.progress_nb_viewers} size={30} />
            </div>
          </Link>
        ))}
      </div>
    </Fade>
  );
}

function CardStreamersWithData({ type, ...props }) {
  const { stats, loading } = useStatsStreamers({ type });

  if (loading) return <CardStreamers streamers={stats} />;

  const streamers =
    type !== "day"
      ? stats.map((s) => ({
          ...s,
          progress_nb_viewers: Math.ceil(s.progress_nb_viewers / s.nb_sessions),
          progress_total_hours: Math.ceil(s.progress_total_hours / s.nb_sessions),
        }))
      : stats;
  return <CardStreamers streamers={streamers} {...props} />;
}

export default React.memo(CardStreamersWithData);
