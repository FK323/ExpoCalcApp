export type CalculatorOperation = "+" | "-" | "×" | "÷" | "=";

interface CalculatorState {
  currentValue: string;
  previousValue: string;
  operation: CalculatorOperation | null;
  isReset: boolean;
}

export const initialState: CalculatorState = {
  currentValue: "0",
  previousValue: "",
  operation: null,
  isReset: true,
};

export const handleNumberInput = (
  state: CalculatorState,
  num: string
): CalculatorState => {
  if (state.isReset) {
    return {
      ...state,
      currentValue: num,
      isReset: false,
    };
  }

  // Prevent multiple zeros at the beginning
  if (state.currentValue === "0" && num === "0") {
    return state;
  }

  // Replace zero with the number if it's the first character
  if (state.currentValue === "0" && num !== ".") {
    return {
      ...state,
      currentValue: num,
    };
  }

  // Prevent multiple decimal points
  if (num === "." && state.currentValue.includes(".")) {
    return state;
  }

  // Maximum length check (to prevent overflow)
  if (state.currentValue.length >= 12) {
    return state;
  }

  return {
    ...state,
    currentValue: state.currentValue + num,
  };
};

export const handleOperation = (
  state: CalculatorState,
  operation: CalculatorOperation
): CalculatorState => {
  // If there's already an ongoing operation, calculate the result first
  if (state.operation && !state.isReset) {
    const result = calculate(state);

    return {
      currentValue: "0",
      previousValue: result,
      operation,
      isReset: true,
    };
  }

  // Otherwise, store the current value and operation
  return {
    currentValue: "0",
    previousValue: state.currentValue,
    operation,
    isReset: true,
  };
};

export const handleEquals = (state: CalculatorState): CalculatorState => {
  if (!state.operation) {
    return state;
  }

  const result = calculate(state);

  return {
    currentValue: result,
    previousValue: "",
    operation: null,
    isReset: true,
  };
};

export const handleClear = (): CalculatorState => {
  return { ...initialState };
};

export const handlePercentage = (state: CalculatorState): CalculatorState => {
  const value = parseFloat(state.currentValue) / 100;
  return {
    ...state,
    currentValue: value.toString(),
    isReset: true,
  };
};

export const handleToggleSign = (state: CalculatorState): CalculatorState => {
  // If the current value is zero, don't do anything
  if (state.currentValue === "0") {
    return state;
  }

  const value = parseFloat(state.currentValue) * -1;
  return {
    ...state,
    currentValue: value.toString(),
  };
};

const calculate = (state: CalculatorState): string => {
  const prev = parseFloat(state.previousValue);
  const current = parseFloat(state.currentValue);
  let result = 0;

  switch (state.operation) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "×":
      result = prev * current;
      break;
    case "÷":
      if (current === 0) {
        return "Error";
      }
      result = prev / current;
      break;
    default:
      return state.currentValue;
  }

  // Handle potential floating point issues and convert to string
  return formatResult(result);
};

const formatResult = (result: number): string => {
  // Convert to string, handling potential floating point issues
  const strResult = result.toString();

  // If the result is an integer, display it as an integer
  if (Number.isInteger(result)) {
    return result.toString();
  }

  // For floating point, limit to 10 decimal places to fit on screen
  if (strResult.includes(".")) {
    const parts = strResult.split(".");
    if (parts[1].length > 10) {
      return result.toFixed(10);
    }
  }

  return strResult;
};

export const getDisplayExpression = (state: CalculatorState): string => {
  if (!state.operation) {
    return "";
  }

  return `${state.previousValue} ${state.operation}`;
};
