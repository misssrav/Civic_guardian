import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import Modal from "react-native-modal";
import Colors from "../../style/colors";
import screen1 from "../../assets/screen1.png";
import screen2 from "../../assets/home.png";
import screen3 from "../../assets/map.png";
import screen4 from "../../assets/simulation.png";
import lightModeMap from "../../assets/lightiosmobmap.jpg";
import mapMobile from "../../assets/iosmobile (1).jpg";
import simMobile from "../../assets/ios mob sim (2).jpg";
import darkMode from "../../assets/darkmobile.jpg";
import darkModeMap from "../../assets/darkmapmob (1).jpg";
import GoogleMap from "../../assets/googleMap.png";

const Manual = ({ onClosePress }) => { // This is the manual component
  return (
    <SafeAreaView style={styles.container}>
      <Modal isVisible={true} style={styles.modal}>
        <View style={styles.modalContent}>
          <ScrollView>
            <View style={{ width: 350, margin: 10 }}>
              <Image source={screen1} style={styles.imageStyle} />
              <Text style={{ alignItems: "center" }}>
                Select CIVIC GUARDIAN on Landing Page
              </Text>
            </View>
            <View style={{ width: 350, margin: 10 }}>
              <Image source={screen2} style={styles.imageStyle} />
              <Text style={{ alignItems: "center" }}>
                You will be directed to map screen where you can Generate Way
              </Text>
            </View>
            <View style={{ width: 350, margin: 10 }}>
              <Image source={screen3} style={styles.imageStyle} />
              <Text style={{ alignItems: "center" }}>
                Once route is generated click on any route if you need alternate
                path
              </Text>
              <Image source={GoogleMap} style={styles.imageStyle} />
              <Text style={{ alignItems: "center" }}>
                Take to google maps screen will port this destination exactly to
                your maps
              </Text>
            </View>

            <View style={{ width: 350, margin: 10 }}>
              <Text style={{ alignItems: "center" }}>About Graph Screen:</Text>
              <Image source={screen4} style={styles.imageStyle} />
              <Text style={{ alignItems: "center" }}>
                Click Simulate now to understand FloydWarshall implementation
              </Text>
              <Text style={{ alignItems: "center" }}>
                Click Reset Simulation to clear or watch again
              </Text>
            </View>
            <View style={{ width: 350, margin: 10 }}>
              <Text style={{ alignItems: "center" }}>
                This is All about mobile screen
              </Text>
              <Image source={mapMobile} style={styles.mobImageStyle} />
            </View>
            <View style={{ width: 350, margin: 10 }}>
              <Image source={lightModeMap} style={styles.mobImageStyle} />
            </View>
            <View style={{ width: 350, margin: 10 }}>
              <Image source={simMobile} style={styles.mobImageStyle} />
            </View>
            <View style={{ width: 350, margin: 10 }}>
              <Image source={darkMode} style={styles.mobImageStyle} />
            </View>
            <View style={{ width: 350, margin: 10 }}>
              <Image source={darkModeMap} style={styles.mobImageStyle} />
              <Text style={{ alignItems: "center" }}>Thank you</Text>
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={() => onClosePress()}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Rest of your content */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    right: 0,
    left: "50%",
    top: 0,
    bottom: 0,
    position: "absolute",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 10,
  },
  closeButton: {
    margin: 10,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: Colors.orange,
    fontSize: 16,
  },
  imageStyle: {
    marginBottom: 10,
    width: 340,
    height: 255,
    resizeMode: "cover", // This ensures the image covers the specified dimensions
  },
  mobImageStyle: {
    marginBottom: 10,
    width: 340,
    height: 740,
    resizeMode: "cover",
  },
});

export default Manual;
