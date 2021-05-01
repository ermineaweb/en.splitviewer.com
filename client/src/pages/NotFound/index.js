import React from "react";
import styles from "./notfound.module.css";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className={styles.root}>
      <h2>Cette page n'existe pas.</h2>
      <h2> Et pourtant elle existe...</h2>
      <h2>
        <Link to={"/"}>Retour a l'Accueil</Link>
      </h2>
    </div>
  );
}

export default NotFound;
