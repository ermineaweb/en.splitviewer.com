import React from "react";
import styles from "./streamerimgcard.module.css";
import { Link } from "react-router-dom";
import { MdBookmark } from "react-icons/md";
import useBookMarks from "../../hooks/useBookMarks";
import Zoom from "react-reveal/Zoom";
// import OnlineBadge from "../OnlineBadge";
import StreamerAvatar from "../StreamerAvatar";

function StreamerImgCard({ streamer }) {
  const { isBookmarked, toggleBookmark } = useBookMarks(streamer.id);
  return (
    <Link to={`/streamer/${streamer.login}`} className={styles.root}>
      <Zoom style={{ width: "100%", height: "100%" }} duration={400}>
        <div style={{ width: "100%", height: "100%" }}>
          <div className={styles.avatar}>
            <StreamerAvatar id={streamer.id} style={{ borderRadius: "5px" }} />
          </div>
          <div className={styles.display_name}>
            <h3>{streamer.display_name}</h3>
          </div>
          <div className={styles.actions} onClick={toggleBookmark(streamer.id)}>
            {isBookmarked && <MdBookmark size={25} color={"#cb4081"} />}
          </div>
        </div>
        {/*<OnlineBadge status={streamer.status} />*/}
      </Zoom>
    </Link>
  );
}

export default React.memo(StreamerImgCard);
