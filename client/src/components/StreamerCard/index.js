import React from "react";
import useBookMarks from "../../hooks/useBookMarks";
import useStreamer from "../../hooks/useStreamer";
import StreamerAvatar from "../StreamerAvatar";
import styles from "./streamercard.module.css";
import { FaTwitch, FaRegBookmark, FaBookmark } from "react-icons/fa";
// import OnlineBadge from "../OnlineBadge";

function StreamerCard({ streamer }) {
  const { isBookmarked, toggleBookmark } = useBookMarks(streamer.id);

  return (
    <div className={styles.root}>
      <h2 className={styles.display_name}>{streamer.display_name}</h2>
      <div className={styles.avatar}>
        <StreamerAvatar id={streamer.id} style={{ borderRadius: "5px" }} />
        {/*<OnlineBadge status={streamer.status} />*/}
      </div>
      <div className={styles.description}>{streamer.description}</div>
      <div className={styles.actions}>
        <a href={`https://www.twitch.tv/${streamer.display_name}`}>
          <FaTwitch size={25} color={"#9147ff"} style={{ padding: "0" }} />
        </a>
        {isBookmarked ? (
          <FaBookmark size={25} color={"#cb4081"} onClick={toggleBookmark(streamer.id)} />
        ) : (
          <FaRegBookmark size={25} color={"#cb4081"} onClick={toggleBookmark(streamer.id)} />
        )}
      </div>
    </div>
  );
}

// function StreamerCardWithData({ id }) {
//   const { streamer, loading } = useStreamer({ id });
//   if (loading) return <StreamerCard streamer={streamer} />;
//   return <StreamerCard streamer={streamer} />;
// }

export default React.memo(StreamerCard);
