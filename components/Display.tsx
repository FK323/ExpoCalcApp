import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DisplayProps {
  value: string;
  expression?: string;
}

const Display: React.FC<DisplayProps> = ({ value, expression = "" }) => {
  return (
    <View style={styles.container}>
      {expression ? (
        <Text
          style={styles.expressionText}
          numberOfLines={1}
          ellipsizeMode="head"
        >
          {expression}
        </Text>
      ) : null}
      <Text style={styles.valueText} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 10,
    minHeight: 120,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  valueText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "right",
  },
  expressionText: {
    fontSize: 24,
    color: "#666666",
    marginBottom: 8,
    textAlign: "right",
  },
});

export default Display;
