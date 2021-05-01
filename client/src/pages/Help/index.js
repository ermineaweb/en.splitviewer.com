import React from "react";
import styles from "./help.module.css";
import { Link } from "react-router-dom";

function HelpPage() {
  return (
    <div className={styles.root}>
      <div className={styles.question}>Pourquoi mon streamer préféré n'est pas présent ?</div>
      <div className={styles.answer}>Nous ne disposons pas d'un serveur assez puissant pour traiter
      tous les streamers. Nous récupérons les statisti</div>
      <h2>
        <Link to={"/"}>Retour a l'Accueil</Link>
      </h2>
    </div>
  );
}

export default HelpPage;
