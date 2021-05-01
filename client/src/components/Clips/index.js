import React from "react";
import styles from "./clips.module.css";
import useClips from "../../hooks/useClips";
import Zoom from "react-reveal/Zoom";

function Clips({ clips }) {
  return (
    <div className={styles.root}>
      {clips.map((clip) => (
        <Zoom key={clip.id} style={{ width: "100%", height: "100%" }} duration={400}>
          <div className={styles.clip}>
            <a href={clip.url}>
              <img src={clip.thumbnail_url} alt={"clip twitch"} className={styles.thumbnail} />
            </a>
            <h4 className={styles.title}> {clip.title}</h4>
          </div>
        </Zoom>
      ))}
    </div>
  );
}

function ClipsWidthData({ id, random }) {
  const { clips, loading } = useClips({ id, random });
  if (loading) return <Clips clips={clips} />;
  return <Clips clips={clips} />;
}

export default React.memo(ClipsWidthData);
