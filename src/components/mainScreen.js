import React, { useState } from "react";
import { View, Text } from "react-native";
import Colors from "../style/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import Manual from "./graph/manual";

const MainScreen = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const goToTabNavigator = () => {
    navigation.navigate("Map");
  };

  const toggleModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <View
        style={{ justifyContent: "center", alignItems: "flex-end", margin: 10 }}
      >
        <TouchableOpacity
          onPress={() => {
            toggleModal();
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: Colors.orange,
              textDecorationLine: "underline",
            }}
          >
            Learn
          </Text>
        </TouchableOpacity>
      </View>
      {isModalVisible && (
        <Manual isVisible={isModalVisible} onClosePress={() => closeModal()} /> // This is the modal component
      )}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <TouchableOpacity onPress={goToTabNavigator}>
            <Text
              style={{
                fontSize: isHovered ? 200 : 160,
                fontWeight: "bold",
                color: Colors.orange,
                marginBottom: isHovered ? "5%" : "7%",
              }}
            >
              Civic Guardian...
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default MainScreen;
