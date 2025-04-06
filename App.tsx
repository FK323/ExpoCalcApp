//Hassan Mir, Fazan Khan, Imad Rana
import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import CalculatorScreen from "./screens/CalculatorScreen";
import ConverterScreen from "./screens/ConverterScreen";
import GraphScreen from "./screens/GraphScreen";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>("calculator");

  // Render the appropriate screen based on currentScreen state
  const renderScreen = () => {
    switch (currentScreen) {
      case "calculator":
        return <CalculatorScreen />;
      case "converter":
        return <ConverterScreen />;
      case "graph":
        return <GraphScreen />;
      default:
        return <CalculatorScreen />;
    }
  };

  // Custom navigation handler to be passed to AppNavigator
  const handleNavigation = (screen: string) => {
    setCurrentScreen(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      <AppNavigator
        currentScreen={currentScreen}
        onScreenChange={handleNavigation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  content: {
    flex: 1,
  },
});
