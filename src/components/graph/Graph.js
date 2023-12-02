import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import ErrorBoundary from "../errorBoundry";

let GraphWeb, GraphMob;

if (Platform.OS === "web") {
  GraphWeb = require("react-vis-network-graph").default;
}

if (Platform.OS === "android" || Platform.OS === "ios") {
  GraphMob = require("react-native-vis-network").default;
}

const Graph = ({ graphOptions, graphNodes }) => { // graphOptions and graphNodes are props
  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <ErrorBoundary>
          <GraphWeb graph={graphNodes} options={graphOptions} />
        </ErrorBoundary>
      ) : Platform.OS === "android" || Platform.OS === "ios" ? (
        <View style={styles.container}>
          <GraphMob data={graphNodes} options={graphOptions} />
        </View>
      ) : (
        <Text>LOADING....</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Graph;
