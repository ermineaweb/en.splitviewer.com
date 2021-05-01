import React, { useEffect, useState } from "react";
import styles from "./battle.module.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import StreamerAvatar from "../../components/StreamerAvatar";
import { kFormatter } from "../../utils";
import useBookMarks from "../../hooks/useBookMarks";
import useSessions from "../../hooks/useSessions";

const data = {
  streamers: [],
  group1: [],
  group2: [],
  groups: ["streamers", "group1", "group2"],
};

function StreamerDraggable({ streamer, provided }) {
  return (
    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={styles.streamer}>
      <StreamerAvatar id={streamer.id} style={{ borderRadius: "4px" }} />
      <div className={styles.username}>{streamer.display_name}</div>
    </div>
  );
}

function Battle() {
  const [filters, setFilters] = useState({ onlineOnly: false, search: "", bookmarksOnly: false });
  const { bookmarks } = useBookMarks();
  const { sessions, loading } = useSessions();
  const [streamersState, setStreamersState] = useState(data);
  const [winner, setWinner] = useState(null);
  const [nbViewers, setNbViewers] = useState({ group1: 0, group2: 0 });

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    // Moving item in the same array
    if (source.droppableId === destination.droppableId) {
      // copy the array
      const oldArray = [...streamersState[source.droppableId]];
      // delete the item from source index
      const itemToDelete = oldArray.splice(source.index, 1);
      // add the item to dest index
      oldArray.splice(destination.index, 0, itemToDelete[0]);
      // save the new state
      setStreamersState((prev) => ({ ...prev, [source.droppableId]: oldArray }));
      return;
    }

    // Moving from one list to another
    const oldArray = [...streamersState[source.droppableId]];
    const newArray = [...streamersState[destination.droppableId]];
    // delete the item from source index
    const itemToDelete = oldArray.splice(source.index, 1);
    // add the item to dest index
    newArray.splice(destination.index, 0, itemToDelete[0]);
    // save the new state
    setStreamersState((prev) => ({ ...prev, [source.droppableId]: oldArray, [destination.droppableId]: newArray }));
  };

  const search = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const changeFilters = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  useEffect(() => {
    if (sessions && sessions.length > 0)
      setStreamersState((prev) => ({
        ...prev,
        streamers: sessions
          .filter((s) => !prev.group1.includes(s))
          .filter((s) => !prev.group2.includes(s))
          .filter((s) => (filters.bookmarksOnly ? bookmarks.includes(s.id) : s))
          .filter((s) => s.display_name?.toLowerCase().includes(filters.search.toLowerCase())),
      }));
  }, [filters, sessions, loading, bookmarks, streamersState.group1, streamersState.group2]);

  // useEffect(() => {
  //   if (!loading && streamers) setStreamersState((prev) => ({ ...prev, streamers: streamers }));
  // }, [streamers, loading]);

  useEffect(() => {
    const nbViewers1 = streamersState["group1"].reduce((t, s) => t + s?.nb_viewers || 0, 0);
    const nbViewers2 = streamersState["group2"].reduce((t, s) => t + s?.nb_viewers || 0, 0);
    setNbViewers({ group1: nbViewers1, group2: nbViewers2 });

    setWinner(() => {
      switch (true) {
        // samuel etienne feature
        case streamersState.group1.some((s) => s.id === "505902512"):
          return "group1";
        case streamersState.group2.some((s) => s.id === "505902512"):
          return "group2";
        case nbViewers.group1 > nbViewers.group2:
          return "group1";
        case nbViewers.group1 < nbViewers.group2:
          return "group2";
        default:
          return null;
      }
    });
  }, [streamersState]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.root}>
        <div className={styles.result1}>
          <div>
            {kFormatter(nbViewers.group1)} viewers {winner === "group1" ? "Win" : ""}
          </div>
        </div>
        <div className={styles.result2}>
          <div>
            {kFormatter(nbViewers.group2)} viewers {winner === "group2" ? "Win" : ""}
          </div>
        </div>

        <div className={styles.filters}>
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

        {data.groups.map((id) => (
          <Droppable key={id} droppableId={id} direction={id === "streamers" ? "" : "horizontal"}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`${winner === id ? styles.winner : ""} ${styles[id]} ${
                  snapshot.isDraggingOver ? styles["dragging"] : ""
                }`}
              >
                {streamersState[id].length <= 0 ? (
                  <div>Glissez-déposez un streamer sur la zone</div>
                ) : (
                  streamersState[id].map((streamer, index) => (
                    <Draggable key={streamer.id} draggableId={streamer.id} index={index}>
                      {(provided) => <StreamerDraggable streamer={streamer} provided={provided} />}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default Battle;
