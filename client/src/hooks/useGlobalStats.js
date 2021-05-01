import useQuery from "./useQuery";

const stats = [
  {
    _id: {
      day: 0,
    },
    nb_viewers: 0,
    nb_streamers: 0,
  },
];

function useGlobalStats() {
  const { data, loading, error } = useQuery(`/stats`);

  if (loading || error || !data) return { stats: stats[0], loading, error };
  return { stats: data[0], loading, error };
}

export default useGlobalStats;
