import React from "react";
import styles from "./globalstats.module.css";
import { kFormatter } from "../../utils";
import useGlobalStats from "../../hooks/useGlobalStats";

function GlobalStats({ stats }) {
  return (
    <div className={styles.root}>
      <div className={styles.stats}>
        <h4>{kFormatter(stats?.nb_viewers || 0)}</h4>
        <h3>viewers</h3>
      </div>
      <div className={styles.stats}>
        <h4>{kFormatter(stats?.nb_streamers || 0)}</h4>
        <h3>streamers</h3>
      </div>
      {/*<div className={styles.stats}>*/}
      {/*  <h4>{kFormatter(stats?.total_hours || 0)}</h4>*/}
      {/*  <h3>heures vues</h3>*/}
      {/*</div>*/}
    </div>
  );
}

function GlobalStatsWithData() {
  const { stats, loading } = useGlobalStats();
  if (loading) return <GlobalStats stats={stats} />;
  return <GlobalStats stats={stats} />;
}

export default React.memo(GlobalStatsWithData);
