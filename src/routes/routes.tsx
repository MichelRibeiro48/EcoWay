import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import IntroPage from "../pages/IntroPage";
import MapPage from "../pages/MapPage";
import PointAbout from "../pages/PointAbout";
import ReportPage from "../pages/ReportPage";
import HomePage from "../pages/HomePage";
import TipsRecyclePage from "../pages/TipsRecyclePage";

const Stack = createNativeStackNavigator();
export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="IntroPage" component={IntroPage} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="MapPage" component={MapPage} />
        <Stack.Screen name="PointAbout" component={PointAbout} />
        <Stack.Screen name="ReportPage" component={ReportPage} />
        <Stack.Screen name="TipsRecyclePage" component={TipsRecyclePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
