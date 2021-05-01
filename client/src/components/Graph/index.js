import React from "react";
import Graph from "react-graph-vis";
// import { useHistory } from "react-router";
import useGraph from "../../hooks/useGraph";
import styles from "./graph.module.css";

function GraphSession({ graph }) {
  // const history = useHistory();
  const options = {
    // autoResize: true,
    interaction: {
      // hideEdgesOnDrag: true,
      // hideEdgesOnZoom: true,
      selectConnectedEdges: true,
      hover: true,
    },

    nodes: {
      borderWidth: 5,
      size: 50,
      color: {
        border: "#e2e2e2",
        background: "#eeeeee",
        highlight: {
          border: "#cb4081",
          background: "#D2E5FF",
        },
        hover: {
          border: "#cb4081",
          background: "#D2E5FF",
        },
      },
      font: { color: "#343434" },
    },

    edges: {
      label: "",
      color: {
        color: "#e39fbf",
        highlight: "#cb4081",
        hover: "#cb4081",
      },
      // length: 300,
      width: 4,
      selectionWidth: 3,
      arrows: {
        to: { enabled: false },
        middle: { enabled: false },
        from: { enabled: false },
      },
    },

    layout: {
      randomSeed: undefined,
      improvedLayout: true,
      clusterThreshold: 150,
      hierarchical: {
        enabled: false,
        levelSeparation: 150,
        nodeSpacing: 500,
        treeSpacing: 300,
        blockShifting: true,
        edgeMinimization: true,
        parentCentralization: true,
        direction: "UD", // UD, DU, LR, RL
        sortMethod: "hubsize", // hubsize, directed
      },
    },
    height: "100%",
    width: "100%",
  };

  // const events = {
  //   select: (event) => {
  //     const { nodes } = event;
  //     history.push(`/streamer/${nodes[0]}`);
  //   },
  // };

  return (
    <Graph
      graph={graph}
      options={options}
      // events={events}
      // getNetwork={(network) => {
      //   //  if you want access to vis.js network api you can set the state in a parent component using this property
      // }}
    />
  );
}

function GraphSessionWithData({ id }) {
  const { graph, loading } = useGraph({ id });
  if (loading) return null;
  return <GraphSession graph={graph} />;
}

export default React.memo(GraphSessionWithData);
