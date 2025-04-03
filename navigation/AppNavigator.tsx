import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface AppNavigatorProps {
  currentScreen: string;
  onScreenChange: (screen: string) => void;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({
  currentScreen,
  onScreenChange,
}) => {
  // Navigation items with their route IDs and labels
  const navigationItems = [
    { id: "calculator", label: "Calculator" },
    { id: "converter", label: "Converter" },
    { id: "graph", label: "Graph" },
  ];

  // Check if a tab is active
  const isActive = (id: string): boolean => {
    return currentScreen === id;
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {navigationItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.tabItem, isActive(item.id) && styles.activeTabItem]}
            onPress={() => onScreenChange(item.id)}
          >
            <Text
              style={[
                styles.tabLabel,
                isActive(item.id) && styles.activeTabLabel,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#00539C",
  },
  tabLabel: {
    fontSize: 14,
    color: "#757575",
  },
  activeTabLabel: {
    color: "#00539C",
    fontWeight: "600",
  },
});

export default AppNavigator;
