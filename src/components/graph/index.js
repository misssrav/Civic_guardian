import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import Colors from "../../style/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ErrorBoundary from "../errorBoundry";
import Graph from "./Graph";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomToast from "./CustomToast";

const GraphScreen = () => { // graphOptions and graphNodes are props
  const [step1, setStep1] = useState(false);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const [step4, setStep4] = useState(false);
  const [step5, setStep5] = useState(false);
  const [simulation, setSimulation] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const options = {
    interaction: {
      selectable: true,
      hover: true,
    },
    autoResize: true,
    layout: {
      hierarchical: false,
    },
    edges: {
      color: "black",
      width: 1,
      arrows: "to;from",
      dashes: false,
      smooth: {
        type: "dynamic",
        forceDirection: "horizontal",
        roundness: 0.5,
      },
      shadow: {
        enabled: true,
      },
    },
    nodes: {
      shape: "ellipse",
      size: 50,
      borderWidth: 5,
      color: {
        border: "red",
        background: "white",
      },
      font: {
        size: 16,
      },
    },
    height: "100%",
    width: "100%",
    physics: {
      forceAtlas2Based: {
        gravitationalConstant: -50,
        centralGravity: 0.001,
        springLength: 200,
        springConstant: 0.08,
      },
      maxVelocity: 50,
      solver: "forceAtlas2Based",
      timestep: 0.35,
      stabilization: {
        enabled: false,
        iterations: 1000,
        updateInterval: 2,
      },
    },
    groups: {
      green: {
        color: {
          border: "green",
          background: "green",
          highlight: {
            border: "green",
            background: "green",
          },
        },
        font: {
          color: "white",
        },
      },
    },
  };

  let fwmatrix;

  if (Platform.OS === "web") { // if platform is web, get the fwmatrix from local storage
    fwmatrix = JSON.parse(localStorage.getItem("fwmatrixForGraph"));
    console.log("fwmatrix at graph on web:", fwmatrix);
  } else if (Platform.OS === "android" || Platform.OS === "ios") {
    const mobFWMatrix = AsyncStorage.getItem("fwmatrix")
      .then((value) => {
        console.log("FWMATRIX ON MOBILE IS", value);
        return JSON.parse(value);
      })
      .catch((error) => {
        console.log("Error in getting FWMATRIX ON MOBILE", error);
      });
    fwmatrix = mobFWMatrix;
  }
  let edges;
  if (Platform.OS === "web") {
    edges = [
      { from: 1, to: 99, label: fwmatrix[0][5]["value"].toString() },
      { from: 1, to: 100, label: fwmatrix[0][6]["value"].toString() },
      { from: 2, to: 99, label: fwmatrix[1][5]["value"].toString() },
      { from: 2, to: 100, label: fwmatrix[1][6]["value"].toString() },
      { from: 3, to: 99, label: fwmatrix[2][5]["value"].toString() },
      { from: 3, to: 100, label: fwmatrix[2][6]["value"].toString() },
      { from: 4, to: 99, label: fwmatrix[3][5]["value"].toString() },
      { from: 4, to: 100, label: fwmatrix[3][6]["value"].toString() },
      { from: 5, to: 99, label: fwmatrix[4][5]["value"].toString() },
      { from: 5, to: 100, label: fwmatrix[4][6]["value"].toString() },
      {
        from: 101,
        to: 99,
        label: fwmatrix[4][6]["value"].toString(),
        color: "green",
      },
      {
        from: 101,
        to: 100,
        label: fwmatrix[4][6]["value"].toString(),
        color: "green",
      },
      {
        from: 99,
        to: 100,
        label: fwmatrix[4][6]["value"].toString(),
        color: "red",
      },
    ];
  } else {
    edges = [
      { from: 1, to: 99, label: "" },
      { from: 1, to: 100, label: "" },
      { from: 2, to: 99, label: "" },
      { from: 2, to: 100, label: "" },
      { from: 3, to: 99, label: "" },
      { from: 3, to: 100, label: "" },
      { from: 4, to: 99, label: "" },
      { from: 4, to: 100, label: "" },
      { from: 5, to: 99, label: "" },
      { from: 5, to: 100, label: "" },
      { from: 101, to: 99, label: "", color: "green" },
      { from: 101, to: 100, label: "", color: "green" },
      { from: 99, to: 100, label: "", color: "red" },
    ];
    console.log("Edges are ", edges);
  }

  let prenodes;
  if (Platform.OS === "web") {
    prenodes = JSON.parse(localStorage.getItem("nodesForGraph")).map((node) => {
      console.log("Node is ", { ...node, label: node.title + " " + node.id });
      if (node.title === "Source" || node.title === "Destination") {
        return { ...node, label: node.title };
      } else {
        return { ...node, label: node.title + " " + node.id };
      }
    });
  }
  let bestWaypoint;
  let nodes;
  if (Platform.OS === "web") {
    bestWaypoint = JSON.parse(localStorage.getItem("best_waypoint"));
    nodes = prenodes.map((node) => {
      if (node.id === 99 || node.id === 100 || node.id === 101) {
        return { ...node, group: "green" };
      } else if (bestWaypoint["latitude"] == node.latlng.latitude) {
        try {
          return { ...node, group: "green", id: 101, label: node.title };
        } catch {
          console.log("Caught");
        }
      } else {
        return node;
      }
    });
  } else {
    nodes = [
      {
        description: "department_store",
        latlng: {
          latitude: 33.8624839,
          longitude: -117.9221267,
        },
        label: "Costco Wholesale",
        id: 1,
      },
      {
        description: "local_government_office",
        latlng: {
          latitude: 33.8811773,
          longitude: -117.9264855,
        },
        label: "North Justice Center",
        id: 2,
      },
      {
        description: "restaurant",
        latlng: {
          latitude: 33.8690644,
          longitude: -117.9238634,
        },
        label: "The Old Spaghetti Factory",
        id: 3,
      },
      {
        description: "local_government_office",
        latlng: {
          latitude: 33.8819285,
          longitude: -117.9264468,
        },
        label: "Orange County Victim-Witness",
        id: 4,
      },
      {
        description: "restaurant",
        latlng: {
          latitude: 33.8708538,
          longitude: -117.9245297,
        },
        label: "Matador Cantina",
        group: "green",
        id: 5,
      },
      {
        description: "restaurant",
        latlng: {
          latitude: 33.8708538,
          longitude: -117.9245297,
        },
        label: "Matador Cantina",
        group: "green",
        id: 101,
      },
      {
        description: "restaurant",
        latlng: {
          latitude: 33.8708538,
          longitude: -117.9245297,
        },
        label: "Source",
        group: "green",
        id: 99,
      },
      {
        description: "restaurant",
        latlng: {
          latitude: 33.8708538,
          longitude: -117.9245297,
        },
        label: "Destination",
        group: "green",
        id: 100,
      },
    ];
  }

  if (Platform.OS === "web") {
    localStorage.setItem("edges", JSON.stringify(edges));
    localStorage.setItem("nodesForGraph", JSON.stringify(nodes));
  }

  const graph = {
    edges: edges,
    nodes: nodes,
  };

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const wait = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const onSimulation = () => { // starts the simulation
    showToast("Starting Simulation");
    setSimulation(true);
    setStep1(true);
    wait(2500)
      .then(() => showToast("Oops! Traffic Detected"))
      .then(() => {
        setStep1(false);
        setStep2(true);
      })
      .then(() => wait(2500))
      .then(() =>
        showToast(
          "Recalculating the best route! Determining popular hubs!",
          "OK"
        )
      )
      .then(() => {
        setStep2(false);
        setStep3(true);
      })
      .then(() => wait(2500))
      .then(() => showToast("Establishing the best possible route!", "OK"))

      .then(() => {
        setStep3(false);
        setStep4(true);
      })
      .then(() => wait(2500))
      .then(() => showToast("Generating the complete matrix!", "OK"))
      .then(() => {
        setStep4(false);
        setStep5(true);
        setToastVisible(false);
      });
  };
  const onReset = () => {
    setStep1(false);
    setStep2(false);
    setStep3(false);
    setStep4(false);
    setStep5(false);
    setSimulation(false);
  };

  return ( // graphOptions and graphNodes are props
    <View style={styles.container}>
      <ErrorBoundary>
        {toastVisible && (
          <CustomToast
            message={toastMessage}
            onClose={() => setToastVisible(false)}
          />
        )}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {!simulation && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                onSimulation();
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons
                  name="graphql"
                  size={24}
                  color={Colors.white}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.buttonText}>Simulate Now</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {step1 && (
          <Graph
            graphOptions={options}
            graphNodes={{
              edges: [{ from: 99, to: 100, label: "", color: "green" }],
              nodes: [
                { ...graph.nodes[graph.nodes.length - 2] },
                { ...graph.nodes[graph.nodes.length - 1] },
              ],
            }}
          ></Graph>
        )}
        {step2 && (
          <Graph
            graphOptions={options}
            graphNodes={{
              edges: [{ from: 99, to: 100, label: "TRAFFIC", color: "red" }],
              nodes: [
                { ...graph.nodes[graph.nodes.length - 2] },
                { ...graph.nodes[graph.nodes.length - 1] },
              ],
            }}
          ></Graph>
        )}
        {step3 && (
          <Graph
            graphOptions={options}
            graphNodes={{
              ...graph,
              edges: [{ from: 99, to: 100, label: "TRAFFIC", color: "red" }],
            }}
          ></Graph>
        )}
        {step4 && (
          <Graph
            graphOptions={options}
            graphNodes={{
              ...graph,
              edges: [
                { from: 101, to: 99, label: "Best Way", color: "green" },
                { from: 101, to: 100, label: "Possible", color: "green" },
                { from: 99, to: 100, label: "TRAFFIC", color: "red" },
              ],
            }}
          ></Graph>
        )}
        {step5 && <Graph graphOptions={options} graphNodes={graph}></Graph>}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {simulation && step5 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                onReset();
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons
                  name="graphql"
                  size={24}
                  color={Colors.white}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.buttonText}>Reset Simulation</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ErrorBoundary>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    backgroundColor: Colors.orange,
    padding: 8,
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
    height: 35,
  },
  buttonText: {
    color: Colors.white,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default GraphScreen;
