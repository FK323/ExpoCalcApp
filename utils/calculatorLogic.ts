//Hassan Mir
import * as math from "mathjs";

// Type for calculator operations
export type CalculatorOperation = "+" | "-" | "×" | "÷";

// Interface for calculator state
export interface CalculatorState {
  currentValue: string;
  previousValue: string;
  operation: CalculatorOperation | null;
  waitingForOperand: boolean;
  expression: string;
}

// Initial calculator state
export const initialCalculatorState: CalculatorState = {
  currentValue: "0",
  previousValue: "",
  operation: null,
  waitingForOperand: false,
  expression: "",
};

// Function to handle number input
export const handleNumberInput = (
  state: CalculatorState,
  num: string
): CalculatorState => {
  // If we're waiting for an operand, replace the current value
  if (state.waitingForOperand) {
    return {
      ...state,
      currentValue: num,
      waitingForOperand: false,
    };
  }

  // If the current value is '0', replace it with the new number
  // unless it's a decimal point
  if (state.currentValue === "0" && num !== ".") {
    return {
      ...state,
      currentValue: num,
    };
  }

  // If adding a decimal point, check if one already exists
  if (num === "." && state.currentValue.includes(".")) {
    return state;
  }

  // Otherwise, append the number to the current value
  return {
    ...state,
    currentValue: state.currentValue + num,
  };
};

// Function to handle operation input
export const handleOperationInput = (
  state: CalculatorState,
  operation: CalculatorOperation
): CalculatorState => {
  // If there's a pending operation, calculate the result first
  if (state.operation && !state.waitingForOperand) {
    const newState = calculateResult(state);
    return {
      ...newState,
      operation,
      waitingForOperand: true,
      expression: `${newState.currentValue} ${operation}`,
    };
  }

  // If we're waiting for an operand, just update the operation
  if (state.waitingForOperand) {
    return {
      ...state,
      operation,
      expression: state.previousValue
        ? `${state.previousValue} ${operation}`
        : `${state.currentValue} ${operation}`,
    };
  }

  // Otherwise, store the current value and operation
  return {
    ...state,
    previousValue: state.currentValue,
    operation,
    waitingForOperand: true,
    expression: `${state.currentValue} ${operation}`,
  };
};

// Function to calculate the result
export const calculateResult = (state: CalculatorState): CalculatorState => {
  // If there's no operation or we're waiting for an operand, return the current state
  if (!state.operation || state.waitingForOperand) {
    return state;
  }

  const leftOperand = parseFloat(state.previousValue || "0");
  const rightOperand = parseFloat(state.currentValue);

  let result: string;

  try {
    switch (state.operation) {
      case "+":
        result = math.format(math.add(leftOperand, rightOperand), {
          precision: 14,
        });
        break;
      case "-":
        result = math.format(math.subtract(leftOperand, rightOperand), {
          precision: 14,
        });
        break;
      case "×":
        result = math.format(math.multiply(leftOperand, rightOperand), {
          precision: 14,
        });
        break;
      case "÷":
        if (rightOperand === 0) {
          result = "Error";
        } else {
          result = math.format(math.divide(leftOperand, rightOperand), {
            precision: 14,
          });
        }
        break;
      default:
        result = state.currentValue;
    }

    // Remove trailing zeros after decimal point
    if (result.includes(".")) {
      result = result.replace(/\.?0+$/, "");
    }

    // If result ends with a decimal point, remove it
    if (result.endsWith(".")) {
      result = result.slice(0, -1);
    }

    return {
      ...state,
      currentValue: result,
      previousValue: "",
      operation: null,
      waitingForOperand: true,
      expression: "",
    };
  } catch (error) {
    return {
      ...state,
      currentValue: "Error",
      previousValue: "",
      operation: null,
      waitingForOperand: true,
      expression: "",
    };
  }
};

// Function to clear the calculator
export const clearCalculator = (): CalculatorState => {
  return initialCalculatorState;
};

// Function to toggle the sign of the current value
export const toggleSign = (state: CalculatorState): CalculatorState => {
  // If the current value is 0 or Error, don't change anything
  if (state.currentValue === "0" || state.currentValue === "Error") {
    return state;
  }

  // Toggle the sign
  const newValue = state.currentValue.startsWith("-")
    ? state.currentValue.slice(1)
    : `-${state.currentValue}`;

  return {
    ...state,
    currentValue: newValue,
  };
};

// Function to calculate percentage
export const calculatePercentage = (
  state: CalculatorState
): CalculatorState => {
  // If the current value is Error, don't change anything
  if (state.currentValue === "Error") {
    return state;
  }

  try {
    const value = parseFloat(state.currentValue);
    const percentage = math.divide(value, 100);

    return {
      ...state,
      currentValue: math
        .format(percentage, { precision: 14 })
        .replace(/\.?0+$/, ""),
    };
  } catch (error) {
    return {
      ...state,
      currentValue: "Error",
    };
  }
};
