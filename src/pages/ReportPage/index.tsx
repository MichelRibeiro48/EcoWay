import { View, Text } from "react-native";
import React from "react";

export default function ReportPage({ route }) {
  const { title } = route.params;
  return (
    <View className="flex-1 items-center justify-center">
      <Text>{title}</Text>
    </View>
  );
}
