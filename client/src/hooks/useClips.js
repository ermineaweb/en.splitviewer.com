import { useEffect, useState } from "react";
import useQuery from "./useQuery";

const clips = [
  {
    id: "1",
    url: "",
    embed_url: "",
    broadcaster_id: "",
    broadcaster_name: "",
    creator_id: "",
    creator_name: "",
    video_id: "",
    game_id: "",
    language: "",
    title: "",
    view_count: 0,
    created_at: "",
    thumbnail_url: "",
  },
  {
    id: "2",
    url: "",
    embed_url: "",
    broadcaster_id: "",
    broadcaster_name: "",
    creator_id: "",
    creator_name: "",
    video_id: "",
    game_id: "",
    language: "",
    title: "",
    view_count: 0,
    created_at: "",
    thumbnail_url: "",
  },
  {
    id: "3",
    url: "",
    embed_url: "",
    broadcaster_id: "",
    broadcaster_name: "",
    creator_id: "",
    creator_name: "",
    video_id: "",
    game_id: "",
    language: "",
    title: "",
    view_count: 0,
    created_at: "",
    thumbnail_url: "",
  },
  {
    id: "4",
    url: "",
    embed_url: "",
    broadcaster_id: "",
    broadcaster_name: "",
    creator_id: "",
    creator_name: "",
    video_id: "",
    game_id: "",
    language: "",
    title: "",
    view_count: 0,
    created_at: "",
    thumbnail_url: "",
  },
];

function useClips({ id, random }) {
  const [url, setUrl] = useState(`/clips/${id}/${random}`);
  const { data, loading, error } = useQuery(url);

  useEffect(() => {
    setUrl(`/clips/${id}/${random}`);
  }, [id, random]);

  if (loading || error || !data) return { clips, loading, error };
  return { clips: data, loading, error };
}

export default useClips;
