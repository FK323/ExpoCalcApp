//Imad Rana
import * as math from "mathjs";

// Define types for graph settings
export interface GraphFunction {
  id: string;
  expression: string;
  color: string;
  isVisible: boolean;
}

export interface GraphRange {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface GraphSettings {
  functions: GraphFunction[];
  range: GraphRange;
  gridStep: number;
}

// Default graph settings
export const initialGraphSettings: GraphSettings = {
  functions: [
    {
      id: "function1",
      expression: "x^2",
      color: "#00539C", // Primary app color
      isVisible: true,
    },
  ],
  range: {
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
  },
  gridStep: 1,
};

// Function to evaluate a mathematical expression at a specific x value
export const evaluateExpression = (
  expression: string,
  x: number
): number | null => {
  try {
    // Replace common functions with mathjs syntax
    const processedExpression = expression
      .replace(/sin\(/g, "sin(")
      .replace(/cos\(/g, "cos(")
      .replace(/tan\(/g, "tan(")
      .replace(/log\(/g, "log10(")
      .replace(/ln\(/g, "log(")
      .replace(/sqrt\(/g, "sqrt(")
      .replace(/\^/g, "^");

    // Evaluate the expression using mathjs
    const result = math.evaluate(processedExpression, { x });
    
    // Check if the result is a valid number
    if (
      result === undefined ||
      result === null ||
      Number.isNaN(result) ||
      !Number.isFinite(result)
    ) {
      return null;
    }
    
    return result;
  } catch (error) {
    // Return null if there's an error evaluating the expression
    console.error("Error evaluating expression:", error);
    return null;
  }
};

// Generate points for plotting a function within a range
export const generatePoints = (
  expression: string,
  range: GraphRange,
  resolution: number = 100
): { x: number; y: number | null }[] => {
  const points: { x: number; y: number | null }[] = [];
  const step = (range.xMax - range.xMin) / resolution;
  
  for (let i = 0; i <= resolution; i++) {
    const x = range.xMin + i * step;
    const y = evaluateExpression(expression, x);
    points.push({ x, y });
  }
  
  return points;
};

// Add a new function to the graph
export const addFunction = (
  settings: GraphSettings,
  expression: string = "x",
  color: string = getRandomColor()
): GraphSettings => {
  const newId = `function${settings.functions.length + 1}`;
  
  return {
    ...settings,
    functions: [
      ...settings.functions,
      {
        id: newId,
        expression,
        color,
        isVisible: true,
      },
    ],
  };
};

// Update an existing function
export const updateFunction = (
  settings: GraphSettings,
  functionId: string,
  updates: Partial<GraphFunction>
): GraphSettings => {
  return {
    ...settings,
    functions: settings.functions.map((f) =>
      f.id === functionId ? { ...f, ...updates } : f
    ),
  };
};

// Remove a function from the graph
export const removeFunction = (
  settings: GraphSettings,
  functionId: string
): GraphSettings => {
  return {
    ...settings,
    functions: settings.functions.filter((f) => f.id !== functionId),
  };
};

// Update the graph range
export const updateRange = (
  settings: GraphSettings,
  newRange: Partial<GraphRange>
): GraphSettings => {
  return {
    ...settings,
    range: { ...settings.range, ...newRange },
  };
};

// Reset the graph to default settings
export const resetGraph = (): GraphSettings => {
  return initialGraphSettings;
};

// Helper function to generate random colors for functions
export const getRandomColor = (): string => {
  // Generate a list of visually distinct colors
  const colors = [
    "#00539C", // Primary blue
    "#FF5733", // Orange
    "#33FF57", // Green
    "#D433FF", // Purple
    "#FF3393", // Pink
    "#33FFF5", // Cyan
    "#FFD133", // Yellow
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

// Utility function to format a number for display
export const formatNumber = (value: number): string => {
  // If it's an integer, don't show decimal places
  if (Number.isInteger(value)) {
    return value.toString();
  }
  
  // Otherwise, format with up to 2 decimal places
  return value.toFixed(2).replace(/\.?0+$/, "");
};

// Calculate tick values for the axes based on range and grid step
export const calculateTicks = (
  min: number,
  max: number,
  step: number
): number[] => {
  const ticks: number[] = [];
  const firstTick = Math.ceil(min / step) * step;
  
  for (let tick = firstTick; tick <= max; tick += step) {
    // Avoid floating point issues by rounding to 10 decimal places
    ticks.push(Math.round(tick * 1e10) / 1e10);
  }
  
  return ticks;
};

// Convert graph coordinate to screen coordinate
export const graphToScreenX = (
  x: number,
  width: number,
  range: GraphRange
): number => {
  return ((x - range.xMin) / (range.xMax - range.xMin)) * width;
};

export const graphToScreenY = (
  y: number,
  height: number,
  range: GraphRange
): number => {
  // Y is inverted in screen coordinates (0 is at the top)
  return height - ((y - range.yMin) / (range.yMax - range.yMin)) * height;
};

// Convert screen coordinate to graph coordinate
export const screenToGraphX = (
  x: number,
  width: number,
  range: GraphRange
): number => {
  return range.xMin + (x / width) * (range.xMax - range.xMin);
};

export const screenToGraphY = (
  y: number,
  height: number,
  range: GraphRange
): number => {
  // Y is inverted in screen coordinates (0 is at the top)
  return range.yMin + ((height - y) / height) * (range.yMax - range.yMin);
};