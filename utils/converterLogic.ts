import * as math from "mathjs";

// Define the categories and their units
export interface Unit {
  id: string;
  name: string;
  mathJsUnit: string;
}

export interface Category {
  id: string;
  name: string;
  units: Unit[];
}

// Define the conversion categories
export const conversionCategories: Category[] = [
  {
    id: "length",
    name: "Length",
    units: [
      { id: "meter", name: "Meter", mathJsUnit: "m" },
      { id: "kilometer", name: "Kilometer", mathJsUnit: "km" },
      { id: "centimeter", name: "Centimeter", mathJsUnit: "cm" },
      { id: "millimeter", name: "Millimeter", mathJsUnit: "mm" },
      { id: "inch", name: "Inch", mathJsUnit: "inch" },
      { id: "foot", name: "Foot", mathJsUnit: "ft" },
      { id: "yard", name: "Yard", mathJsUnit: "yard" },
      { id: "mile", name: "Mile", mathJsUnit: "mi" },
    ],
  },
  {
    id: "mass",
    name: "Weight/Mass",
    units: [
      { id: "gram", name: "Gram", mathJsUnit: "g" },
      { id: "kilogram", name: "Kilogram", mathJsUnit: "kg" },
      { id: "milligram", name: "Milligram", mathJsUnit: "mg" },
      { id: "pound", name: "Pound", mathJsUnit: "lb" },
      { id: "ounce", name: "Ounce", mathJsUnit: "oz" },
      { id: "ton", name: "Metric Ton", mathJsUnit: "tonne" },
    ],
  },
  {
    id: "volume",
    name: "Volume",
    units: [
      { id: "liter", name: "Liter", mathJsUnit: "l" },
      { id: "milliliter", name: "Milliliter", mathJsUnit: "ml" },
      { id: "cubicMeter", name: "Cubic Meter", mathJsUnit: "m^3" },
      { id: "gallon", name: "Gallon (US)", mathJsUnit: "gal" },
      { id: "quart", name: "Quart (US)", mathJsUnit: "qt" },
      { id: "pint", name: "Pint (US)", mathJsUnit: "pt" },
      { id: "cup", name: "Cup", mathJsUnit: "cup" },
      { id: "fluidOunce", name: "Fluid Ounce (US)", mathJsUnit: "floz" },
    ],
  },
  {
    id: "temperature",
    name: "Temperature",
    units: [
      { id: "celsius", name: "Celsius", mathJsUnit: "celsius" },
      { id: "fahrenheit", name: "Fahrenheit", mathJsUnit: "fahrenheit" },
      { id: "kelvin", name: "Kelvin", mathJsUnit: "kelvin" },
    ],
  },
  {
    id: "time",
    name: "Time",
    units: [
      { id: "second", name: "Second", mathJsUnit: "s" },
      { id: "minute", name: "Minute", mathJsUnit: "minute" },
      { id: "hour", name: "Hour", mathJsUnit: "h" },
      { id: "day", name: "Day", mathJsUnit: "day" },
      { id: "week", name: "Week", mathJsUnit: "week" },
      { id: "month", name: "Month", mathJsUnit: "month" },
      { id: "year", name: "Year", mathJsUnit: "year" },
    ],
  },
  {
    id: "area",
    name: "Area",
    units: [
      { id: "squareMeter", name: "Square Meter", mathJsUnit: "m^2" },
      { id: "squareKilometer", name: "Square Kilometer", mathJsUnit: "km^2" },
      { id: "hectare", name: "Hectare", mathJsUnit: "hectare" },
      { id: "squareFoot", name: "Square Foot", mathJsUnit: "ft^2" },
      { id: "squareInch", name: "Square Inch", mathJsUnit: "in^2" },
      { id: "acre", name: "Acre", mathJsUnit: "acre" },
      { id: "squareMile", name: "Square Mile", mathJsUnit: "mi^2" },
    ],
  },
];

// Function to convert units using math.js
export const convertUnits = (
  value: number,
  fromUnit: string,
  toUnit: string
): string => {
  try {
    // Check for invalid input
    if (isNaN(value)) {
      return "Invalid number";
    }

    // Find the mathJs units
    const fromUnitObj = findUnitById(fromUnit);
    const toUnitObj = findUnitById(toUnit);

    if (!fromUnitObj || !toUnitObj) {
      return "Invalid unit";
    }

    // Special case for same unit conversion (no need to convert)
    if (fromUnit === toUnit) {
      return value.toString();
    }

    // Use math.js to evaluate the conversion
    const fromUnitStr = fromUnitObj.mathJsUnit;
    const toUnitStr = toUnitObj.mathJsUnit;

    // Handle the conversion
    let result;
    try {
      const conversionExpression = `${value} ${fromUnitStr} to ${toUnitStr}`;
      result = math.evaluate(conversionExpression);
    } catch (conversionError) {
      console.error("First conversion attempt failed:", conversionError);

      // Try alternative unit strings for time units if the first attempt fails
      if (fromUnit === "minute" || toUnit === "minute") {
        const altFromUnit = fromUnit === "minute" ? "min" : fromUnitStr;
        const altToUnit = toUnit === "minute" ? "min" : toUnitStr;

        const altExpression = `${value} ${altFromUnit} to ${altToUnit}`;
        result = math.evaluate(altExpression);
      } else {
        throw conversionError;
      }
    }

    // Format the result to avoid unnecessary decimal places
    const formattedResult = math.format(result, {
      precision: 6,
      notation: "auto",
    });

    return formattedResult;
  } catch (error) {
    // Handle any conversion errors
    console.error("Conversion error:", error);
    return "Conversion error";
  }
};

// Helper function to find a unit by its ID
const findUnitById = (unitId: string): Unit | undefined => {
  for (const category of conversionCategories) {
    const unit = category.units.find((u) => u.id === unitId);
    if (unit) {
      return unit;
    }
  }
  return undefined;
};

// Find a category by its ID
export const findCategoryById = (categoryId: string): Category | undefined => {
  return conversionCategories.find((c) => c.id === categoryId);
};
