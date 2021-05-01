import useQuery from "./useQuery";
import useBookMarks from "./useBookMarks";

const streamers = [
  { id: "1", display_name: "", profile_image_url: "" },
  { id: "2", display_name: "", profile_image_url: "" },
  { id: "3", display_name: "", profile_image_url: "" },
  { id: "4", display_name: "", profile_image_url: "" },
  { id: "5", display_name: "", profile_image_url: "" },
  { id: "6", display_name: "", profile_image_url: "" },
  { id: "7", display_name: "", profile_image_url: "" },
  { id: "8", display_name: "", profile_image_url: "" },
];

function useStreamers() {
  const { data, loading, error } = useQuery("/streamers");
  const { bookmarks } = useBookMarks();

  if (loading || error) return { streamers, loading, error };

  const sortBookmarkFunction = (a, b) => {
    if (bookmarks.indexOf(a.id) > bookmarks.indexOf(b.id)) return -1;
    if (bookmarks.indexOf(a.id) < bookmarks.indexOf(b.id)) return 1;
  };

  const sortViewersFunction = (a, b) => {
    if (a.nb_viewers > b.nb_viewers) return -1;
    if (a.nb_viewers < b.nb_viewers) return 1;
  };

  // viewers sorting
  const dataSortedViewers = data.sort(sortViewersFunction);

  // bookmarks sorting
  const dataSortedBookmark = dataSortedViewers.sort(sortBookmarkFunction);

  return { streamers: dataSortedBookmark, loading, error };
}

export default useStreamers;
