import useLocalStorage from "./useLocalStorage";

function useBookMarks(id) {
  const [bookmarks, updateBookmarks] = useLocalStorage("bookmarks", []);

  const toggleBookmark = id => e => {
    e.stopPropagation();
    e.preventDefault();
    const index = bookmarks.findIndex(b => b === id);
    if (index !== -1) updateBookmarks(bookmarks.filter(b => b !== id));
    else updateBookmarks([...bookmarks, id]);
  };

  return { bookmarks, toggleBookmark, isBookmarked: bookmarks.includes(id) };
}

export default useBookMarks;
