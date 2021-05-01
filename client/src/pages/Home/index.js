import React from "react";
import styles from "./home.module.css";
import StreamersStats from "../../components/StreamersStats";
import GlobalStats from "../../components/GlobalStats";

function Home() {
  return (
    <div className={styles.root}>
      <div className={styles.stats}>
        <GlobalStats />
      </div>

      <div className={styles.days}>
        <h2>Top streamers hier</h2>
        <StreamersStats type={"day"} left />
      </div>

      <div className={styles.weeks}>
        <h2>Top streamers semaine</h2>
        <StreamersStats type={"week"} left />
      </div>
    </div>
  );
}

export default Home;
