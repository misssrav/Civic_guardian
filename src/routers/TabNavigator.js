import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Fontisto } from "@expo/vector-icons";
import { TouchableOpacity, View, SafeAreaView } from "react-native";

import MapScreen from "../components/map";
import GraphScreen from "../components/graph";

const TabBar = ({ state, navigation }) => {
  const [visible, setVisible] = useState(true);

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#000",
        maxHeight: visible ? 64 : 0,
        borderTopWidth: 0.5,
        borderTopColor: "black",
      }}
    >
      {state.routes.map((route, index) => {
        const label = route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };
        return (
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            key={label}
            style={[
              {
                minHeight: 48,
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 2,
              },
            ]}
          >
            {label === "Graph" && (
              <Fontisto name="graphql" size={24} color="white" />
            )}
            {label === "Map" && (
              <Fontisto name="map-marker-alt" size={24} color="white" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Tab = createBottomTabNavigator(); // Create the tab navigator

export const TabNavigator = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Tab.Navigator
        initialRouteName="Map"
        header={null}
        headerMode="none"
        tabBar={(props) => <TabBar {...props} />}
        tabBarOptions={{
          keyboardHidesTabBar: true,
        }}
        backBehavior={"none"}
        screenOptions={({ route }) => ({
          headerShown: false, // Hide the header for each tab
        })}
      >
        <Tab.Screen name="Graph" component={GraphScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};
