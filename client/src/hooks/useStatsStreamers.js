import { useEffect, useState } from "react";
import useQuery from "./useQuery";

const stats = [
  { id: "1", date: "", nb_viewers: 0 },
  { id: "2", date: "", nb_viewers: 0 },
  { id: "3", date: "", nb_viewers: 0 },
  { id: "4", date: "", nb_viewers: 0 },
  { id: "5", date: "", nb_viewers: 0 },
  { id: "6", date: "", nb_viewers: 0 },
  { id: "7", date: "", nb_viewers: 0 },
  { id: "8", date: "", nb_viewers: 0 },
];

function useStatsStreamers({ id, type }) {
  const [url, setUrl] = useState(`/stats/all/${type}/8`);
  const { data, loading, error } = useQuery(url);

  useEffect(() => {
    setUrl(`/stats/all/${type}/8`);
  }, [id, type]);

  if (loading || error || !data) return { stats: stats, loading, error };
  return { stats: data, loading, error };
}

export default useStatsStreamers;
