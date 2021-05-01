import useQuery from "./useQuery";
import { useEffect, useState } from "react";

const APP_IMAGES_PATH = process.env.REACT_APP_IMAGES_PATH || "https://en.splitviewer.com/images";
const PERCENT = Number(process.env.REACT_APP_PERCENT_GRAPH) || 1;

const streamerData = {
  _id: "",
  date: "",
  daysession: "",
  description: "",
  display_name: "",
  id: "1",
  login: "",
  nb_viewers: 0,
  profile_image_url: "",
  progress_nb_viewers: 0,
  sessions: [],
  view_count: 0,
};

function useGraph({ id }) {
  const [url, setUrl] = useState(`/session/${id}`);
  const { data, loading, error } = useQuery(url);

  useEffect(() => {
    setUrl(`/session/${id}`);
  }, [id]);

  if (loading || error || !data?.sessions)
    return { streamer: streamerData, graph: { nodes: [], edges: [] }, loading, error };

  const { sessions, ...streamer } = data;
  const streamOn = sessions?.some((s) => s.id === id);

  const nodes = sessions
    ?.filter((s) => s.id)
    ?.filter((s) => s.percent >= PERCENT)
    ?.map((s) => ({
      id: s.id,
      image: `${APP_IMAGES_PATH}/${s.id}.webp`,
      label: s.display_name,
      shape: "circularImage",
      // percent: s.percent,
    }));

  if (!streamOn && nodes)
    nodes.push({
      id: data.id,
      image: `${APP_IMAGES_PATH}/${id}.png`,
      label: data.display_name,
      shape: "circularImage",
    });

  const edges = sessions
    ?.filter((s) => s.id)
    ?.filter((s) => s.id !== id)
    ?.filter((s) => s.percent >= PERCENT)
    ?.map((s) => ({
      from: data.id,
      to: s.id,
    }));

  return {
    streamer,
    graph: { nodes, edges },
    // if the streamer didn't stream, we want to know that
    streamOn,
    loading,
    error,
  };
}

export default useGraph;
