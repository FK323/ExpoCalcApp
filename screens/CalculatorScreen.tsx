import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import Display from "../components/Display";
import Keypad from "../components/Keypad";
import {
  initialState,
  handleNumberInput,
  handleOperation,
  handleEquals,
  handleClear,
  handlePercentage,
  handleToggleSign,
  getDisplayExpression,
  CalculatorOperation,
} from "../utils/calculatorLogic";

const CalculatorScreen: React.FC = () => {
  const [state, setState] = useState(initialState);

  const handleNumber = (num: string) => {
    setState((currentState) => handleNumberInput(currentState, num));
  };

  const handleOperator = (operation: CalculatorOperation) => {
    setState((currentState) => handleOperation(currentState, operation));
  };

  const handleEqual = () => {
    setState((currentState) => handleEquals(currentState));
  };

  const handleClearPress = () => {
    setState(handleClear());
  };

  const handlePercentagePress = () => {
    setState((currentState) => handlePercentage(currentState));
  };

  const handleToggleSignPress = () => {
    setState((currentState) => handleToggleSign(currentState));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Display
          value={state.currentValue}
          expression={getDisplayExpression(state)}
        />
        <Keypad
          onNumberPress={handleNumber}
          onOperationPress={handleOperator}
          onClearPress={handleClearPress}
          onEqualsPress={handleEqual}
          onPercentagePress={handlePercentagePress}
          onToggleSignPress={handleToggleSignPress}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-end",
  },
});

export default CalculatorScreen;
