import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomePage from "../pages/HomePage";
import IntroPage from "../pages/IntroPage";
import ReportPage from "../pages/ReportPage";

const Stack = createNativeStackNavigator();
export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="IntroPage" component={IntroPage} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="ReportPage" component={ReportPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
