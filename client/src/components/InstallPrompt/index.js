import React, { useEffect } from "react";
import styles from "./installprompt.module.css";
import useInstallPwaPrompt from "../../hooks/useInstallPwaPrompt";

function InstallPrompt({ isVisible, setVisible }) {
  const [prompt, promptToInstall] = useInstallPwaPrompt();

  const hide = () => {
    setVisible(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (prompt) setVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [prompt]);

  return (
    isVisible && (
      <div onClick={hide} className={styles.root}>
        <button onClick={hide}>Fermer</button>
        <div>Tu veux revenir facilement ? Ajoute la Web App en une seconde.</div>
        <button onClick={promptToInstall}>Ajouter</button>
      </div>
    )
  );
}

export default InstallPrompt;
