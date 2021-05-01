import useQuery from "./useQuery";
import { useEffect, useState } from "react";
import { shuffleArray } from "../utils";

const PERCENT = Number(process.env.REACT_APP_PERCENT_CLOSED_STREAMERS) || 1;

const closedStreamers = [
  { id: "1", display_name: "", profile_image_url: "" },
  { id: "2", display_name: "", profile_image_url: "" },
  { id: "3", display_name: "", profile_image_url: "" },
  { id: "4", display_name: "", profile_image_url: "" },
];

function useClosedStreamers({ id }) {
  const [url, setUrl] = useState(`/session/${id}`);
  const { data, loading, error } = useQuery(url);

  useEffect(() => {
    setUrl(`/session/${id}`);
  }, [id]);

  if (loading || error || !data || !data._id) return { closedStreamers, loading, error };

  shuffleArray(data?.sessions);

  return {
    // remove streamer's session
    closedStreamers:
      data?.sessions
        ?.filter((s) => s.id)
        .filter((s) => s.id !== id)
        ?.filter((s) => s.percent >= PERCENT)
        .slice(0, 4) || [],
    loading,
    error,
  };
}

export default useClosedStreamers;
