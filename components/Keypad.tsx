//Imad Rana
import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "./Button";
import { CalculatorOperation } from "../utils/calculatorLogic";

interface KeypadProps {
  onNumberPress: (num: string) => void;
  onOperationPress: (operation: CalculatorOperation) => void;
  onClearPress: () => void;
  onEqualsPress: () => void;
  onPercentagePress: () => void;
  onToggleSignPress: () => void;
}

const Keypad: React.FC<KeypadProps> = ({
  onNumberPress,
  onOperationPress,
  onClearPress,
  onEqualsPress,
  onPercentagePress,
  onToggleSignPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button title="AC" type="function" onPress={onClearPress} />
        <Button title="+/-" type="function" onPress={onToggleSignPress} />
        <Button title="%" type="function" onPress={onPercentagePress} />
        <Button
          title="÷"
          type="operation"
          onPress={() => onOperationPress("÷")}
        />
      </View>
      <View style={styles.row}>
        <Button title="7" onPress={() => onNumberPress("7")} />
        <Button title="8" onPress={() => onNumberPress("8")} />
        <Button title="9" onPress={() => onNumberPress("9")} />
        <Button
          title="×"
          type="operation"
          onPress={() => onOperationPress("×")}
        />
      </View>
      <View style={styles.row}>
        <Button title="4" onPress={() => onNumberPress("4")} />
        <Button title="5" onPress={() => onNumberPress("5")} />
        <Button title="6" onPress={() => onNumberPress("6")} />
        <Button
          title="-"
          type="operation"
          onPress={() => onOperationPress("-")}
        />
      </View>
      <View style={styles.row}>
        <Button title="1" onPress={() => onNumberPress("1")} />
        <Button title="2" onPress={() => onNumberPress("2")} />
        <Button title="3" onPress={() => onNumberPress("3")} />
        <Button
          title="+"
          type="operation"
          onPress={() => onOperationPress("+")}
        />
      </View>
      <View style={styles.row}>
        <Button title="0" wide onPress={() => onNumberPress("0")} />
        <Button title="." onPress={() => onNumberPress(".")} />
        <Button title="=" type="equal" onPress={onEqualsPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});

export default Keypad;
