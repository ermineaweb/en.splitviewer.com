import React from "react";
import CardStreamerImg from "../StreamerImgCard";
import useClosedStreamers from "../../hooks/useClosedStreamers";

function StreamersClosed({ closedStreamers }) {
  return (
    <div>
      {closedStreamers.map((streamer) => (
        <CardStreamerImg streamer={streamer} key={streamer.id} />
      ))}
    </div>
  );
}

function StreamersClosedWithData({ id }) {
  const { closedStreamers, loading } = useClosedStreamers({ id });
  if (loading) return <StreamersClosed closedStreamers={closedStreamers} />;
  return <StreamersClosed closedStreamers={closedStreamers} />;
}

export default React.memo(StreamersClosedWithData);
