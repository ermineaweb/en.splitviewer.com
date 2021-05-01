import useQuery from "./useQuery";
import { useEffect, useState } from "react";

const streamer = {
  _id: "",
  broadcaster_type: "",
  description: "",
  display_name: "",
  id: "1",
  login: "",
  profile_image_url: "",
  type: "",
  view_count: 0,
  nb_viewers: 0,
  status: "",
};

function useStreamer({ login }) {
  const [url, setUrl] = useState(`/streamer/${login}`);
  const { data, loading, error } = useQuery(url);

  useEffect(() => {
    setUrl(`/streamer/${login}`);
  }, [login]);

  if (loading || error || !data || !data._id) return { streamer, loading, error };
  return { streamer: data, loading, error };
}

export default useStreamer;
