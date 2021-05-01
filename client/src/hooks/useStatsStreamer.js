import { useEffect, useState } from "react";
import useQuery from "./useQuery";

const stats = [{ date: "", nb_viewers: 0, total_hours: 0 }];

function useStatsStreamer({ id, type }) {
  const [url, setUrl] = useState(`/stats/${type}/${id}`);
  const { data, loading, error } = useQuery(url);

  useEffect(() => {
    setUrl(`/stats/${type}/${id}`);
  }, [id, type]);

  if (loading || error || !data) return { stats: stats, loading, error };
  return { stats: data, loading, error };
}

export default useStatsStreamer;
