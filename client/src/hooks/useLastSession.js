import useQuery from "./useQuery";
import { useEffect, useState } from "react";

const session = {
  _id: "",
  id: "",
  date: "",
  daysession: "",
  description: "",
  display_name: "",
  profile_image_url: "",
  nb_viewers: 0,
  progress_nb_viewers: 0,
  sessions: [],
  view_count: 0,
};

function useLastSession({ id }) {
  const [url, setUrl] = useState(`/session/${id}`);
  const { data, loading, error } = useQuery(url);

  useEffect(() => {
    setUrl(`/session/${id}`);
  }, [id]);

  if (loading || error || !data || !data._id) return { session, loading, error };
  return { session: data, loading, error };
}

export default useLastSession;
