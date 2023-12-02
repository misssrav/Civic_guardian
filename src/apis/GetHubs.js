import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function getHubs(current_location) {
  console.log("Hubs called with current location as ", current_location);
  let hub = [];
  const apiKey = "AIzaSyA0P4DLkwK2kdikcnu8NPS69mvYfwjCQ_E"; // Add your key here

  // Google Places API
  let finalURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${current_location.latitude},${current_location.longitude}&radius=10000&type=gas_station&key=${apiKey}`;
  if (Platform.OS === "web") {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    finalURL = `${proxyUrl}${finalURL}`;
  }

  fetch(`${finalURL}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      data.results.forEach((object, index) => {
        if (index < 5) {
          hub.push({ // pushes the top 5 gas stations to the hub array
            latlng: {
              latitude: object.geometry.location.lat,
              longitude: object.geometry.location.lng,
            },
            title: object.name,
            description: object.types[0],
            id: index + 1,
          });
        }
      });
      if (Platform.OS === "web") {
        hub.push(JSON.parse(localStorage.getItem("origin"))); // pushes origin and destination to the hub array
        hub.push(JSON.parse(localStorage.getItem("destination")));
        localStorage.setItem("nodes", JSON.stringify(hub));
        localStorage.setItem("nodesForGraph", JSON.stringify(hub));
        localStorage.setItem("hub", JSON.stringify(hub));
      }

      if (Platform.OS === "android" || Platform.OS === "ios") {
        let pushOrigin, pushDestination;
        AsyncStorage.getItem("origin")
          .then((value) => { // pushes origin and destination to the hub array
            pushOrigin = JSON.parse(value);
            return pushOrigin;
          })
          .then((pushOrigin) => hub.push(pushOrigin));
        AsyncStorage.getItem("destination")
          .then((value) => {
            pushDestination = JSON.parse(value);
            return pushDestination;
          })
          .then((pushDestination) => hub.push(pushDestination));
        AsyncStorage.setItem("nodes", JSON.stringify(hub)); // pushes the top 5 gas stations to the hub array
        AsyncStorage.setItem("hub", JSON.stringify(hub));
      }

      return hub;
    })
    .catch((error) => {
      console.error("Error Fetching Data Here", error);
    });
  return hub;
}

export default getHubs;
