import React from "react";

const APP_IMAGES_PATH = process.env.REACT_APP_IMAGES_PATH || "https://en.splitviewer.com/images";

function StreamerAvatar({ id, style, skeleton }) {
  if (skeleton)
    return (
      <div
        style={{
          backgroundColor: "grey",
          width: "100%",
          height: "100%",
          position: "relative",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          ...style,
        }}
      />
    );

  return (
    <div
      style={{
        backgroundImage: `url(${APP_IMAGES_PATH}/${id}.webp)`,
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        ...style,
      }}
    />
  );
}

export default StreamerAvatar;
