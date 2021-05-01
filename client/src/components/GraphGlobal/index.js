import React from "react";
import Graph from "react-graph-vis";
import useGraphGlobal from "../../hooks/useGraphGlobal";
import styles from "./graphglobal.module.css";

function GraphGlobal({ graph }) {
  const options = {
    interaction: {
      hideEdgesOnDrag: true,
      hideEdgesOnZoom: true,
      selectConnectedEdges: true,
      hover: true,
    },

    nodes: {
      borderWidth: 3,
      size: 25,
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
      width: 0.8,
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
        levelSeparation: 120,
        nodeSpacing: 120,
        treeSpacing: 140,
        blockShifting: true,
        edgeMinimization: true,
        parentCentralization: true,
        direction: "UD", // UD, DU, LR, RL
        sortMethod: "hubsize", // hubsize, directed
      },
    },

    physics: {
      stabilization: false,
      barnesHut: {
        gravitationalConstant: -1500,
        springConstant: 0.001,
        springLength: 75,
        centralGravity: 0.4,
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

function GraphGlobalWithData({ percent, type }) {
  const { graph, loading } = useGraphGlobal({ type, count: 500, percent });
  if (loading) return null;
  return <GraphGlobal graph={graph} />;
}

export default React.memo(GraphGlobalWithData);
