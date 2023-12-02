import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { MainStackNavigator } from "./MainStackNavigator";

const RootNavigator = ({}) => {
  return (
    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>
  );
};

export default RootNavigator;
