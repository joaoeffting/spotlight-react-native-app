import { COLORS } from "@/constants/theme";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Loader() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <Text>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </Text>
    </View>
  );
}
