import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// talks with backend floyd warshall algorithm to get best waypoint
async function floydWarshallNode(nodes) {
  const nodesList = nodes.map((node) => ({ id: node.key, ...node }));
  console.log("Nodes list is ", nodesList); // Retrieved from google places api
  const payload = {
    data: nodesList,
  };

  let url = "http://localhost:8000/getBestWayPoint"; // backend api url

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    if (Platform.OS === "web") {
      localStorage.setItem("fwmatrix", JSON.stringify(data["fwmatrix"]));
      if (localStorage.getItem("fwmatrixForGraph") === null) {
        localStorage.setItem(
          "fwmatrixForGraph",
          JSON.stringify(data["fwmatrix"])
        );
      }
    } else {
      AsyncStorage.setItem("fwmatrix", JSON.stringify(data["fwmatrix"]));
    }
    const waypoint = getBestWaypoint(data);
    return waypoint;
  } else {
    console.log("Error from backend :", response.status);
    return null;
  }
}

function getBestWaypoint(data) {
  try {
    console.log("Returning best waypoint ", data);
    return data["node"]["latlng"]; // Returns best waypoint latlng object
  } catch {
    console.log("Error in getBestWaypoint");
    return null;
  }
}

export default floydWarshallNode;
