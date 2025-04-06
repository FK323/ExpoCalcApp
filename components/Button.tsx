//Hassan Mir
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonProps {
  onPress: () => void;
  title: string;
  type?: "number" | "operation" | "function" | "equal";
  style?: ViewStyle;
  textStyle?: TextStyle;
  wide?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  type = "number",
  style,
  textStyle,
  wide = false,
}) => {
  let buttonStyle: ViewStyle;
  let buttonTextStyle: TextStyle;

  switch (type) {
    case "operation":
      buttonStyle = styles.operationButton;
      buttonTextStyle = styles.operationButtonText;
      break;
    case "function":
      buttonStyle = styles.functionButton;
      buttonTextStyle = styles.functionButtonText;
      break;
    case "equal":
      buttonStyle = styles.equalButton;
      buttonTextStyle = styles.equalButtonText;
      break;
    default:
      buttonStyle = styles.numberButton;
      buttonTextStyle = styles.numberButtonText;
  }

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, wide && styles.wideButton, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, buttonTextStyle, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    borderRadius: 8,
    height: 60,
    width: 60,
  },
  wideButton: {
    width: 130,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "500",
  },
  numberButton: {
    backgroundColor: "#E0E0E0",
  },
  numberButtonText: {
    color: "#000000",
  },
  operationButton: {
    backgroundColor: "#00539C", //
  },
  operationButtonText: {
    color: "#FFFFFF",
  },
  functionButton: {
    backgroundColor: "#C0C0C0",
  },
  functionButtonText: {
    color: "#000000",
  },
  equalButton: {
    backgroundColor: "#00539C", //
  },
  equalButtonText: {
    color: "#FFFFFF",
  },
});

export default Button;
