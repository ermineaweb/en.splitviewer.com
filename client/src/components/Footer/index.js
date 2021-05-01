import React from "react";
import styles from "./footer.module.css";
import { FaTwitter, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className={styles.root}>
      <a href="https://twitter.com/splitviewer">
        <FaTwitter size={28} />
      </a>
      <a href={"mailto:contact@splitviewer.com"}>
        <FaEnvelope size={28} />
      </a>
      {/*<Link to={"/help"}>Aide</Link>*/}
    </footer>
  );
}

export default Footer;
