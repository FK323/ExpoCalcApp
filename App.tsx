import React from "react";
import { View, StyleSheet } from "react-native";
import CalculatorScreen from "./screens/CalculatorScreen";

export default function App() {
  return (
    <View style={styles.container}>
      <CalculatorScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
});
