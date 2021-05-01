import React from "react";
import { useParams } from "react-router";
import styles from "./streamer.module.css";
import Clips from "../../components/Clips";
import Graph from "../../components/Graph";
import StreamerCard from "../../components/StreamerCard";
import Charts from "../../components/Charts";
import StreamersClosed from "../../components/StreamersClosed";
import useStreamer from "../../hooks/useStreamer";

function Streamer() {
  const { login } = useParams();
  const { streamer, loading } = useStreamer({ login });

  return (
    <div className={styles.root}>
      <div className={styles.information}>{!loading && <StreamerCard streamer={streamer} />}</div>

      <div className={styles.stats}>
        <h2>Stats</h2>
        {!loading && <Charts id={streamer.id} />}
      </div>

      <div className={styles.streamers}>
        <h2>Vous aimerez également</h2>
        {!loading && <StreamersClosed id={streamer.id} />}
      </div>

      <div className={styles.graph}>
        <h2>Ses viewers ont aussi regardé</h2>
        {!loading && <Graph id={streamer.id} />}
      </div>

      <div className={styles.clipsTop}>
        <h2>Top clips</h2>
        {!loading && <Clips id={streamer.id} random={false} />}
      </div>

      <div className={styles.clipsRandom}>
        <h2>Clips randoms</h2>
        {!loading && <Clips id={streamer.id} random={true} />}
      </div>
    </div>
  );
}

export default Streamer;
