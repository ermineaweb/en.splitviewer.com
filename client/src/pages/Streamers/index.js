import React, { useEffect, useState } from "react";
import useStreamers from "../../hooks/useStreamers";
import styles from "./streamers.module.css";
import StreamersCardImg from "../../components/StreamersImgCard";
import useBookMarks from "../../hooks/useBookMarks";

function Streamers() {
  const { streamers: data, loading } = useStreamers();
  const [filters, setFilters] = useState({ onlineOnly: false, search: "", bookmarksOnly: false });
  const [streamers, setStreamers] = useState(data);
  const { bookmarks } = useBookMarks();

  const search = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const changeFilters = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  useEffect(() => {
    if (data)
      setStreamers(
        data
          .filter((s) => (filters.onlineOnly ? s.status === "online" : s))
          .filter((s) => (filters.bookmarksOnly ? bookmarks.includes(s.id) : s))
          .filter((s) => s.display_name?.toLowerCase().includes(filters.search.toLowerCase()))
      );
  }, [filters, data, loading, bookmarks]);

  return (
    <div className={styles.root}>
      <div className={styles.filters}>
        <div>{streamers.length} Streamers</div>
        {/*<div>*/}
        {/*  <label htmlFor="connected">En ligne</label>*/}
        {/*  <input name="onlineOnly" value={filters.onlineOnly} onChange={changeFilters} type="checkbox" id="connected" />*/}
        {/*</div>*/}
        <div>
          <label htmlFor="bookmarks">Favoris</label>
          <input
            name="bookmarksOnly"
            value={filters.bookmarksOnly}
            onChange={changeFilters}
            type="checkbox"
            id="bookmarks"
          />
        </div>
        <input
          name="search"
          value={filters.search}
          onChange={search}
          type="text"
          placeholder={"Chercher un streamer..."}
        />
      </div>
      <div className={styles.streamers}>
        <StreamersCardImg streamers={streamers} loading={loading} />
      </div>
    </div>
  );
}

export default Streamers;
