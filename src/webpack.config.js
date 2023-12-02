const path = require("path");

module.exports = {
  // ... other webpack configuration settings ...

  resolve: {
    alias: {
      "react-native-maps": path.resolve(
        __dirname,
        "../node_modules/react-native-maps"
      ), // For mobile
      "react-native-web-maps": "@preflower/react-native-web-maps", // For web
      "react-native-maps-directions": path.resolve(
        __dirname,
        "../node_modules/react-native-maps-directions"
      ), // For Mobile
      "react-vis-network-graph": path.resolve(
        __dirname,
        "../node_modules/react-vis-network-graph"
      ), //For web
      "react-native-vis-network": path.resolve(
        __dirname,
        "../node_modules/react-native-vis-network"
      ), //for mobile
    },
  },
};
