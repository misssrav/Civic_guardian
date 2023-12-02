import React, { useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import ErrorBoundary from "../errorBoundry";
import ShowMapScreen from "./ShowMapComponent";
import getHubs from "../../apis/GetHubs";
import floydWarshallNode from "../../apis/FloydWarshallNode";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MainMapScreen = ({ navigation }) => { // navigation is a prop
  const origin = {
    id: 99,
    label: "Source",
    title: "Source",
    latlng: { latitude: 33.843663, longitude: -117.945171 },
    latitude: 33.843663,
    longitude: -117.945171,
  };
  const destination = {
    id: 100,
    label: "Destination",
    title: "Destination",
    latlng: { latitude: 33.8252956, longitude: -117.8307728 },
    latitude: 33.8252956,
    longitude: -117.8307728,
  };

  if (Platform.OS === "web") {
    localStorage.setItem("origin", JSON.stringify(origin));
    localStorage.setItem("destination", JSON.stringify(destination));
  }

  if (Platform.OS === "android" || Platform.OS === "ios") {
    AsyncStorage.setItem("origin", JSON.stringify(origin));
    AsyncStorage.setItem("destination", JSON.stringify(destination));
  }

  const [bestWaypoint, setBestWaypoint] = useState(null);
  const [stateOfMap, setStateOfMap] = useState({
    coords: [],
    region: {
      latitude: destination.latitude, // Latitude for fullerton
      longitude: destination.longitude, // Longitude for fullerton
      latitudeDelta: 0.05, // Adjust this value for zoom level
      longitudeDelta: 0.045, // Adjust this value for zoom level
    },
    origin: origin, // Latitude and longitude for the origin marker
    destination: destination, // Latitude and longitude for the destination marker
    markers: [],
    googleMapsLoaded: false,
    plot: {
      draw: false,
      origin: { latitude: origin.latitude, longitude: origin.longitude },
      destination: {
        latitude: destination.latitude,
        longitude: destination.longitude,
      },
      waypoint: { latitude: 33.8589565, longitude: -117.9589782 },
    },
  });
  const newMarkers = getHubs(stateOfMap.region);

  const handleGenerateWay = () => {
    floydWarshallNode(newMarkers)
      .then((response) => {
        console.log("Response from FloydWarshall API is ", response);
        setBestWaypoint(response);
        console.log("Waiting for the response to remove loading screen");
        setStateOfMap({
          ...stateOfMap,
          markers: newMarkers,
          googleMapsLoaded: true,
          plot: {
            ...stateOfMap.plot,
            draw: !stateOfMap.plot.draw,
            waypoint: response,
          },
        });
      })
      .catch((error) => {
        console.log("Error from API floydWarshall is ", error);
      });
  };

  return ( // returns the ShowMapScreen component
    <View style={styles.container}>
      {/* <ErrorBoundary> */}
      <View style={styles.container}>
        <ShowMapScreen
          stateOfMap={stateOfMap}
          onPressPlotter={() => {
            handleGenerateWay();
          }}
          navigation={navigation}
        ></ShowMapScreen>
      </View>
      {/* </ErrorBoundary> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    marginTop: 60,
    left: 20,
    backgroundColor: "Black",
    height: 40,
    width: 150,
  },
});

export default MainMapScreen;
