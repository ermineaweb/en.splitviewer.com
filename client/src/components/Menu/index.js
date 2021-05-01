import React from "react";
import { Link } from "react-router-dom";
import logo from "../../theme/icon.png";
import styles from "./menu.module.css";

function Menu() {
  return (
    <header className={styles.root}>
      <Link to={"/"} className={styles.logo}>
        <img src={logo} width={"45px"} height={"45px"} alt={"logo"} />
      </Link>
      <nav className={styles.nav}>
        <Link to={"/"}>
          <h4>Accueil</h4>
        </Link>
        <Link to={"/streamers"}>
          <h4>Streamers</h4>
        </Link>
        <Link to={"/graph"}>
          <h4>Graph</h4>
        </Link>
        {/*<Link to={"/battle"}>*/}
        {/*  <h4>Battle</h4>*/}
        {/*</Link>*/}
      </nav>
    </header>
  );
}

export default Menu;
