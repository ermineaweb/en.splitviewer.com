import React from "react";
import styles from "./progress.module.css";
import { MdTrendingDown, MdTrendingUp } from "react-icons/md";

function Progress({ number, size }) {
  return (
    <div className={styles.root}>
      {!!number && (
        <>
          <h4>
            {number >= 0 && "+"}
            {number} %
          </h4>
          {number >= 0 ? (
            <MdTrendingUp color={"#5ea770"} size={size} />
          ) : (
            <MdTrendingDown color={"#b83333"} size={size} />
          )}
        </>
      )}
    </div>
  );
}

export default React.memo(Progress);
