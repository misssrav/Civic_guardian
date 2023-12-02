import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TabNavigator } from "./TabNavigator";
import MainScreen from "../components/mainScreen";

const Stack = createStackNavigator();

export const MainStackNavigator = ({}) => { 
  return (
    <Stack.Navigator
      initialRouteName="Civic Guardian"
      headerMode="none"
      mode="card"
    >
      <Stack.Screen name="Civic Guardian" component={MainScreen} />
      <Stack.Screen name="Map" component={TabNavigator} />
    </Stack.Navigator>
  );
};
