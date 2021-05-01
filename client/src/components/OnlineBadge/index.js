import React from "react";
import styles from "./onlinebadge.module.css";

function OnlineBadge({ status }) {
  return status === "online" && <div className={styles.root} />;
}

export default OnlineBadge;
