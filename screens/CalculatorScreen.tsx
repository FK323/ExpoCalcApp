import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";

// Import components
import Display from "../components/Display";
import Keypad from "../components/Keypad";

// Import calculator logic
import {
  CalculatorState,
  CalculatorOperation,
  initialCalculatorState,
  handleNumberInput,
  handleOperationInput,
  calculateResult,
  clearCalculator,
  toggleSign,
  calculatePercentage,
} from "../utils/calculatorLogic";

const CalculatorScreen: React.FC = () => {
  // State to track calculator values and operations
  const [state, setState] = useState<CalculatorState>(initialCalculatorState);

  // Handler for number press
  const handleNumberPress = (num: string) => {
    setState((prevState) => handleNumberInput(prevState, num));
  };

  // Handler for operation press
  const handleOperationPress = (operation: CalculatorOperation) => {
    setState((prevState) => handleOperationInput(prevState, operation));
  };

  // Handler for equals press
  const handleEqualsPress = () => {
    setState((prevState) => calculateResult(prevState));
  };

  // Handler for clear press
  const handleClearPress = () => {
    setState(clearCalculator());
  };

  // Handler for toggle sign press
  const handleToggleSignPress = () => {
    setState((prevState) => toggleSign(prevState));
  };

  // Handler for percentage press
  const handlePercentagePress = () => {
    setState((prevState) => calculatePercentage(prevState));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.calculatorContainer}>
        <Display value={state.currentValue} expression={state.expression} />
        <Keypad
          onNumberPress={handleNumberPress}
          onOperationPress={handleOperationPress}
          onEqualsPress={handleEqualsPress}
          onClearPress={handleClearPress}
          onToggleSignPress={handleToggleSignPress}
          onPercentagePress={handlePercentagePress}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  calculatorContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-end",
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
});

export default CalculatorScreen;
