import React from "react";
import StreamerImgCard from "../StreamerImgCard";

function StreamersImgCard({ streamers }) {
  return (
    <>
      {streamers.map((streamer) => (
        <StreamerImgCard streamer={streamer} key={streamer.id} />
      ))}
    </>
  );
}

function StreamersImgCardWithData({ streamers, loading }) {
  if (loading) return <StreamersImgCard streamers={streamers} />;
  return <StreamersImgCard streamers={streamers} />;
}

export default React.memo(StreamersImgCardWithData);
