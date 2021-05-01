import React, { useState } from "react";
import styles from "./graph.module.css";
import GraphGlobal from "../../components/GraphGlobal";
import useDebounce from "../../hooks/useDebounce";

function Graph() {
  const [percent, setPercent] = useState(10);
  const { debouncedValue } = useDebounce({ value: percent });
  const [type, setType] = useState("day");

  const changePercent = (e) => {
    setPercent(e.target.value);
  };

  const changeType = (e) => {
    setType(e.target.value);
  };

  return (
    <div className={styles.root}>
      <div className={styles.link}>
        <label htmlFor="link">Force du lien entre communautés</label>
        <input id={"link"} type="range" onChange={changePercent} value={percent} max={50} step={5} min={10} />
      </div>

      <div className={styles.period}>
        <label htmlFor="type">Période</label>
        <select id={"type"} value={type} onChange={changeType}>
          <option value="day">Streams d'Hier</option>
          <option value="week">Sur les 7 derniers jours</option>
        </select>
      </div>

      <div className={styles.graph}>
        <GraphGlobal percent={debouncedValue} type={type} />
      </div>
    </div>
  );
}

export default Graph;
