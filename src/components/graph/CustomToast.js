import React from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import Colors from "../../style/colors";

const CustomToast = ({ message, onClose }) => { // This is the toast component
  return (
    <Modal transparent={true} visible={true}>
      <View style={styles.modalContainer}>
        <View style={styles.toastContainer}>
          <View style={styles.blueBackground}></View>
          <View style={styles.whiteBackground}>
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({ // Styles for the toast component
  modalContainer: {
    flex: 1,
    alignItems: "center",
  },
  toastContainer: {
    backgroundColor: "transparent",
    padding: 16,
    borderRadius: 8,
    width: "29%",
    flexDirection: "row", // Use flexDirection 'row' to align two views horizontally
  },
  blueBackground: {
    backgroundColor: Colors.orange,
    width: "5%", // Adjust the percentage as needed
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  whiteBackground: {
    backgroundColor: Colors.white,
    flex: 1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    padding: 9,
    alignItems: "center",
    justifyContent: "space-between",
  },
  message: {
    color: Colors.black,
    marginBottom: 8,
  },
});

export default CustomToast;
