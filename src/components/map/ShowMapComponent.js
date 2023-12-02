import React, { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";

import loadGoogleMapsAPI from "./webMapComponent"; // Import the function
import mapStyle from "./mapStyle";
import ErrorBoundary from "../errorBoundry";
import fetchRouteData from "../../apis/GetCoords";

import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

import Colors from "../../style/colors";

import floydWarshallNode from "../../apis/FloydWarshallNode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-gesture-handler";

const apiKey = "AIzaSyA0P4DLkwK2kdikcnu8NPS69mvYfwjCQ_E"; // Replace with your API key

let MapViewMob, MarkerMob, MapViewDirectionsMob;

if (Platform.OS === "android" || Platform.OS === "ios") {
  MapViewMob = require("react-native-maps").default;
  MarkerMob = require("react-native-maps").Marker;
  MapViewDirectionsMob = require("react-native-maps-directions").default;
}
let MapView;

if (Platform.OS === "web") {
  MapView = require("@preflower/react-native-web-maps").default;
}

// Create the debounce function
const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    try {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (typeof func == "function") {
          func(...args);
        }
      }, delay);
    } catch (error) {
      console.log("Error in debounce", error);
    }
  };
};

export default class MapScreen extends Component {
  constructor(props) {
    super(props);

    // this.state = this.props.stateOfMap;
    this.state = {
      ...this.props.stateOfMap,
      showIcon: false,
      mapPlotted: false,
      waypoint: {}, // Add a state variable to control icon visibility
    };
    this.debouncedOnRegionChange = debounce(this.onRegionChange, 10);
  }

  async componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState(this.props.stateOfMap);
    }

    if (
      prevProps.stateOfMap.plot.waypoint !==
        this.props.stateOfMap.plot.waypoint &&
      Object.keys(this.props.stateOfMap.plot.waypoint).length !== 0
    ) {
      if (Platform.OS === "web") {
        try {
          // localStorage.setItem('best_waypoint', JSON.stringify(this.props.stateOfMap.plot.waypoint))
          AsyncStorage.setItem(
            "best_waypoint",
            JSON.stringify(this.props.stateOfMap.plot.waypoint)
          );
          if (Platform.OS === "web") {
            localStorage.setItem(
              "best_waypoint",
              JSON.stringify(this.props.stateOfMap.plot.waypoint)
            );
          }

          if (Platform.OS === "android" || Platform.OS === "ios") {
            AsyncStorage.setItem(
              "best_waypoint",
              JSON.stringify(this.props.stateOfMap.plot.waypoint)
            );
          }

          const newcoords = await fetchRouteData(
            this.props.stateOfMap.plot.origin,
            this.props.stateOfMap.plot.waypoint,
            this.props.stateOfMap.plot.destination
          );
          this.setState({ coords: newcoords });
          this.setState({ mapPlotted: true });
        } catch (error) {
          console.error("Error fetching COORDS", error);
        }
      }
    }
  }

  componentDidMount() {
    if (Platform.OS === "web") {
      loadGoogleMapsAPI(() => {
        this.setState({ googleMapsLoaded: true });
      });
    }
  }

  //  Create a debounced version of onRegionChange
  debouncedOnRegionChange = debounce((newRegion) => {
    // Check if the new region has valid latitude and longitude
    if (
      !isNaN(newRegion.latitude) &&
      !isNaN(newRegion.longitude) &&
      isFinite(newRegion.latitude) &&
      isFinite(newRegion.longitude)
    ) {
      // Update the state only if the new region has valid coordinates
      this.setState({ region: newRegion });
    }
  }, 10);

  onRegionChangeComplete = (region) => {
    console.log("Region changed:", region);
  };

  failMapsResponse =
    "This API project is not authorized to use this API. Please ensure this API is activated in the Google Cloud Console: https://console.cloud.google.com/apis/api/maps_backend?project=_ ";
  onPress = (event) => {
    console.log("Map pressed:", event.nativeEvent.coordinate);
  };

  onDoublePress = (event) => {
    console.log("Map double pressed:", event.nativeEvent.coordinate);
  };

  onPanDrag = () => {
    console.log("Map panned or dragged");
  };

  // onPolylineClicked = () => {
  onPolylineClicked = async () => {
    this.setState(() => ({ showIcon: true }));
    // const hub = JSON.parse(localStorage.getItem('hub'));
    let hub;
    if (Platform.OS === "web") {
      hub = JSON.parse(localStorage.getItem("hub"));
    }

    if (Platform.OS === "android" || Platform.OS === "ios") {
      const hubString = await AsyncStorage.getItem("hub");
      hub = JSON.parse(hubString);
    }

    const hasWaypoint = hub.some((object) => {
      return (
        object.latlng.latitude == this.props.stateOfMap.plot.waypoint.latitude
      );
    });
    const filteredHub = hub.filter((object) => {
      if (
        object.latlng.latitude == this.props.stateOfMap.plot.waypoint.latitude
      ) {
        return false;
      }
      return true;
    });
    console.log("Filtered hub array:", filteredHub);
    // localStorage.setItem('hub', JSON.stringify(filteredHub));
    if (Platform.OS === "web") {
      localStorage.setItem("hub", JSON.stringify(filteredHub));
    }

    if (Platform.OS === "android" || Platform.OS === "ios") {
      AsyncStorage.setItem("hub", JSON.stringify(filteredHub));
    }

    console.log("Hub array has waypoint:", hasWaypoint);
    floydWarshallNode(filteredHub)
      .then(async (response) => {
        this.props.stateOfMap.plot.waypoint = response;
        // localStorage.setItem('best_waypoint', JSON.stringify(this.props.stateOfMap.plot.waypoint))
        if (Platform.OS === "web") {
          localStorage.setItem(
            "best_waypoint",
            JSON.stringify(this.props.stateOfMap.plot.waypoint)
          );
        }

        if (Platform.OS === "android" || Platform.OS === "ios") {
          AsyncStorage.setItem(
            "best_waypoint",
            JSON.stringify(this.props.stateOfMap.plot.waypoint)
          );
        }

        console.log("Output from floydWarshallNode:", response);
        const newcoords = await fetchRouteData(
          this.props.stateOfMap.plot.origin,
          this.props.stateOfMap.plot.waypoint,
          this.props.stateOfMap.plot.destination
        );
        this.setState({ coords: newcoords });
        this.setState({ showIcon: false });
      })
      .catch((error) => {
        console.log("Error from API to get coords is ", error);
        alert("No More Waypoints left! Please consider the last one");
      });
  };

  render() {
    const {
      coords,
      region,
      origin,
      destination,
      markers,
      googleMapsLoaded,
      plot,
      showIcon,
    } = this.state; // Destructure the state variables
    // Import images with Expo's asset management
    const custom_pin = require("../../assets/custom_image.png");
    return (
      <View style={styles.container}>
        {googleMapsLoaded && Platform.OS === "web" ? (
          <View style={styles.container}>
            <ErrorBoundary>
              <MapView
                style={styles.map}
                initialRegion={this.state.region}
                region={this.state.region}
                onRegionChange={(new_region) => {
                  this.debouncedOnRegionChange(new_region);
                }}
                onRegionChangeComplete={this.onRegionChangeComplete}
                onPress={this.onPress}
                onDoublePress={this.onDoublePress}
                onPanDrag={this.onPanDrag}
                zoomEnabled={true}
                zoomControlEnabled={true}
                mapType="terrain"
                showsPointsOfInterest={false}
              >
                <MapView.Marker coordinate={origin} title="Origin">
                  <View style={styles.markerContainer}>
                    <img source={custom_pin} style={styles.markerImage} />
                  </View>
                </MapView.Marker>

                <MapView.Marker coordinate={destination} title="Destination">
                  <View style={styles.markerContainer}>
                    <img source={custom_pin} style={styles.markerImage} />
                  </View>
                </MapView.Marker>

                {markers.map((marker, index) => (
                  <MapView.Marker
                    key={index}
                    coordinate={marker.latlng}
                    title={marker.title}
                    description={marker.description}
                  />
                ))}
                {coords && (
                  <MapView.Polyline
                    coordinates={coords.map((coord) => ({
                      latitude: coord[0],
                      longitude: coord[1],
                    }))}
                    strokeWidth={8}
                    strokeColor={showIcon ? "red" : "royalblue"}
                    tappable={true}
                    onClick={() => {
                      this.onPolylineClicked();
                    }}
                  />
                )}
              </MapView>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.props.onPressPlotter}
                >
                  <View style={{ flexDirection: "row" }}>
                    <MaterialCommunityIcons
                      name="map-marker-path"
                      size={24}
                      color={Colors.white}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.buttonText}>Generate Way</Text>
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <TextInput
                      style={{ flex: 1, padding: 5 }}
                      placeholder="Enter origin"
                      placeholderTextColor="#808080"
                      onSubmitEditing={async (event) => {
                        console.log(
                          "Text recieved is ",
                          event.nativeEvent.text
                        );
                        const originResponseJson = await fetch(
                          `https://maps.googleapis.com/maps/api/geocode/json?address=${event.nativeEvent.text}&key=AIzaSyA0P4DLkwK2kdikcnu8NPS69mvYfwjCQ_E`
                        )
                          .then((response) => {
                            return response.json();
                          })
                          .then((data) => {
                            console.log(data.results[0].geometry.location),
                              alert(this.failMapsResponse);
                          });
                      }}
                    />
                    <View style={{ width: 1, backgroundColor: "#ccc" }} />
                    <TextInput
                      style={{ flex: 1, padding: 5 }}
                      placeholder="Enter destination"
                      placeholderTextColor="#808080"
                      onSubmitEditing={async (event) => {
                        const destinationResponseJson = await fetch(
                          `https://maps.googleapis.com/maps/api/geocode/json?address=${event.nativeEvent.text}&key=AIzaSyA0P4DLkwK2kdikcnu8NPS69mvYfwjCQ_E`
                        )
                          .then((response) => {
                            return response.json();
                          })
                          .then((data) => {
                            console.log(data.results[0].geometry.location),
                              alert(this.failMapsResponse);
                          });
                      }}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    console.log("Pressed");
                    Linking.openURL(
                      `https://www.google.com/maps/dir/?api=1&origin=${plot.origin.latitude},${plot.origin.longitude}&destination=${plot.destination.latitude},${plot.destination.longitude}&waypoints=${plot.waypoint.latitude},${plot.waypoint.longitude}`
                    );
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <FontAwesome
                      name="location-arrow"
                      size={24}
                      color={Colors.white}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.buttonText}>Google Maps</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ErrorBoundary>
          </View>
        ) : Platform.OS === "android" || Platform.OS === "ios" ? ( 
          <View style={styles.container}>
            <MapViewMob
              style={styles.map}
              initialRegion={this.state.region}
              region={this.state.region}
              onRegionChange={(new_region) => {
                this.debouncedOnRegionChange(new_region);
              }}
              customMapStyle={mapStyle}
            >
              <MarkerMob coordinate={origin} title="Origin">
                <View style={styles.markerContainer}>
                  <Image source={custom_pin} style={styles.markerImage} />
                </View>
              </MarkerMob>

              <MarkerMob coordinate={destination} title="Destination">
                <View style={styles.markerContainer}>
                  <Image source={custom_pin} style={styles.markerImage} />
                </View>
              </MarkerMob>

              {markers &&
                markers.map((marker, index) => (
                  <MarkerMob
                    key={index}
                    coordinate={marker.latlng}
                    title={marker.title}
                    description={marker.description}
                  />
                ))}

              {plot.draw && (
                <MapViewDirectionsMob
                  origin={origin}
                  destination={destination}
                  waypoint={plot.waypoint}
                  strokeColor={showIcon ? "red" : "royalblue"}
                  tappable={true}
                  onPress={() => {
                    this.onPolylineClicked();
                  }}
                  apikey={apiKey}
                  strokeWidth={14}
                />
              )}
            </MapViewMob>
            <TouchableOpacity
              style={styles.button}
              onPress={this.props.onPressPlotter}
            >
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons
                  name="map-marker-path"
                  size={24}
                  color={Colors.white}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.buttonText}>Generate Way</Text>
              </View>
            </TouchableOpacity>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={styles.rgnView}>
                <Text style={styles.rgnText}>Region:</Text>
                <Text style={styles.rgnText}>{region.latitude}</Text>
                <Text style={styles.rgnText}>{region.longitude}</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text>LOADING....</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderColor: Colors.white,
    borderWidth: 8,
    borderTopWidth: 4,
    borderBottomWidth: 4,
  },
  markerContainer: {
    width: 40,
    height: 40,
  },
  markerImage: {
    flex: 1,
    width: undefined,
    height: undefined,
  },

  rgnText: {
    // fontWeight: "bold",
    fontSize: 12,
    color: "#666666",
  },
  rgnView: { flexDirection: "row", alignItems: "flex-end" },
  button: {
    backgroundColor: Colors.orange,
    padding: 8,
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
    height: 35,
    // width: "15%",
  },
  buttonText: {
    color: Colors.white,
    textAlign: "center",
    fontWeight: "bold",
  },
});
