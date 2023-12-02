async function fetchRouteData(
  originLatLong,
  waypointLatLong,
  destinationLatLong
) {
  console.log("Recieved waypoint as ", waypointLatLong);
  const origin = `${originLatLong.latitude},${originLatLong.longitude}`;
  const destination = `${destinationLatLong.latitude},${destinationLatLong.longitude}`;
  const waypoint = `${waypointLatLong.latitude},${waypointLatLong.longitude}`;
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const apiKey = "AIzaSyA0P4DLkwK2kdikcnu8NPS69mvYfwjCQ_E"; // Replace with your API key

  try {
    const response = await fetch( // fetches route data from google maps api
      `${proxyUrl}https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&waypoints=${waypoint}&destination=${destination}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const coords = extractCoords(data.routes[0].overview_polyline);
    return coords;
  } catch (error) {
    console.error("Error fetching route with routes api:", error);
    return [];
  }
}

function extractCoords(overviewPolyline) { // extracts coordinates from google maps api
  try {
    if (
      overviewPolyline &&
      window.google &&
      window.google.maps &&
      window.google.maps.geometry &&
      window.google.maps.geometry.encoding
    ) {
      const points = window.google.maps.geometry.encoding.decodePath(
        overviewPolyline.points // decodes the polyline
      );
      if (points && points.length > 0) {
        return points.map((point) => [point.lat(), point.lng()]);
      } else {
        console.error("No points found in the decoded polyline");
        return [];
      }
    } else {
      console.error(
        "Google Maps JavaScript API not loaded or encoding library not available"
      );
      return [];
    }
  } catch (error) {
    console.error("Error decoding polyline:", error);
    return [];
  }
}

export default fetchRouteData;
