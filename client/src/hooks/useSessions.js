import useQuery from "./useQuery";

const sessions = [];

function useSessions() {
  const { data, loading, error } = useQuery(`/sessions`);

  if (loading || error || !data || !data) return { sessions, loading, error };
  return { sessions: data, loading, error };
}

export default useSessions;
