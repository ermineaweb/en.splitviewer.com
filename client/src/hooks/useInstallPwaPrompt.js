import { useEffect, useState } from "react";

function useInstallPwaPrompt() {
  const [prompt, setPrompt] = useState(null);

  const promptToInstall = () => {
    if (prompt) return prompt.prompt();
    // return Promise.reject(new Error("Tried installing before browser sent 'beforeinstallprompt' event"));
  };

  useEffect(() => {
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(ua);

    const ready = (e) => {
      e.preventDefault();
      setPrompt(e);
    };

    (async () => {
      //check if browser version supports the api
      if ("getInstalledRelatedApps" in window.navigator) {
        const relatedApps = await navigator.getInstalledRelatedApps();
        const appExist = relatedApps.some((app) => app.platform === "webapp" && app.url === "https://en.splitviewer.com");
        //if your PWA exists in the array it is installed
        // && !window.matchMedia("(display-mode: standalone)").matches
        if (isMobile && !appExist) {
          // todo google analytics to see if PWA is used
          window.addEventListener("beforeinstallprompt", ready);
        }
      }
    })();

    return () => {
      window.removeEventListener("beforeinstallprompt", ready);
    };
  }, []);

  return [prompt, promptToInstall];
}

export default useInstallPwaPrompt;
