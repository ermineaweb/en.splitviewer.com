import useQuery from "./useQuery";
import {useEffect, useState} from "react";

const APP_IMAGES_PATH = process.env.REACT_APP_IMAGES_PATH || "https://en.splitviewer.com/images";

function useGraphGlobal({ type, count, percent }) {
  const [url, setUrl] = useState(`/graph/all/${type}/${percent}/${count}`);
  const { data, loading, error } = useQuery(url);

  useEffect(() => {
    setUrl(`/graph/all/${type}/${percent}/${count}`);
  }, [type, count, percent]);

  if (loading || error || !data) return { graph: { nodes: [], edges: [] }, loading, error };

  const nodes = data?.map((s) => ({
    id: s.id,
    image: `${APP_IMAGES_PATH}/${s.id}.webp`,
    label: s.display_name,
    shape: "circularImage",
    // percent: s.percent,
  }));

  const edges = data
    // ?.filter((s) => s.percent >= PERCENT)
    ?.map((streamer) => {
      return streamer?.sessions?.map((s) => ({ from: streamer.id, to: s.id }));
    })
    .flat();

  return { graph: { nodes, edges }, loading, error };
}

export default useGraphGlobal;
