//Fazan Khan
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  conversionCategories,
  convertUnits,
  findCategoryById,
  Category,
  Unit,
} from "../utils/converterLogic";

const ConverterScreen: React.FC = () => {
  // State management
  const [inputValue, setInputValue] = useState<string>("1");
  const [result, setResult] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    conversionCategories[0].id
  );
  const [fromUnit, setFromUnit] = useState<string>(
    conversionCategories[0].units[0].id
  );
  const [toUnit, setToUnit] = useState<string>(
    conversionCategories[0].units[1].id
  );
  const [currentCategory, setCurrentCategory] = useState<Category>(
    conversionCategories[0]
  );

  // Update current category when selected category changes
  useEffect(() => {
    const category = findCategoryById(selectedCategory);
    if (category) {
      setCurrentCategory(category);
      // Set default units when category changes
      setFromUnit(category.units[0].id);
      setToUnit(
        category.units.length > 1 ? category.units[1].id : category.units[0].id
      );
    }
  }, [selectedCategory]);

  // Perform conversion when any input changes
  useEffect(() => {
    handleConversion();
  }, [inputValue, fromUnit, toUnit]);

  // Handle the conversion
  const handleConversion = () => {
    const value = parseFloat(inputValue);
    const convertedValue = convertUnits(value, fromUnit, toUnit);
    setResult(convertedValue);
  };

  // Swap the from and to units
  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  // Get the name of the selected unit
  const getUnitName = (unitId: string): string => {
    const unit = currentCategory.units.find((u) => u.id === unitId);
    return unit ? unit.name : "";
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Unit Converter</Text>

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryButtonsContainer}>
                {conversionCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id &&
                        styles.selectedCategoryButton,
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === category.id &&
                          styles.selectedCategoryButtonText,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Unit Selection and Input */}
          <View style={styles.conversionContainer}>
            {/* From Unit */}
            <View style={styles.unitContainer}>
              <Text style={styles.sectionTitle}>From</Text>
              <ScrollView
                style={styles.unitScrollView}
                showsVerticalScrollIndicator={false}
              >
                {currentCategory.units.map((unit) => (
                  <TouchableOpacity
                    key={unit.id}
                    style={[
                      styles.unitButton,
                      fromUnit === unit.id && styles.selectedUnitButton,
                    ]}
                    onPress={() => setFromUnit(unit.id)}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        fromUnit === unit.id && styles.selectedUnitButtonText,
                      ]}
                    >
                      {unit.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TextInput
                style={styles.input}
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType="numeric"
                selectTextOnFocus
              />
            </View>

            {/* Swap Button */}
            <TouchableOpacity
              style={styles.swapButton}
              onPress={handleSwapUnits}
            >
              <Text style={styles.swapButtonText}>⇄</Text>
            </TouchableOpacity>

            {/* To Unit */}
            <View style={styles.unitContainer}>
              <Text style={styles.sectionTitle}>To</Text>
              <ScrollView
                style={styles.unitScrollView}
                showsVerticalScrollIndicator={false}
              >
                {currentCategory.units.map((unit) => (
                  <TouchableOpacity
                    key={unit.id}
                    style={[
                      styles.unitButton,
                      toUnit === unit.id && styles.selectedUnitButton,
                    ]}
                    onPress={() => setToUnit(unit.id)}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        toUnit === unit.id && styles.selectedUnitButtonText,
                      ]}
                    >
                      {unit.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={[styles.input, styles.resultDisplay]}>
                <Text style={styles.resultText}>{result}</Text>
              </View>
            </View>
          </View>

          {/* Formula Display */}
          <View style={styles.formulaContainer}>
            <Text style={styles.formulaText}>
              {inputValue} {getUnitName(fromUnit)} = {result}{" "}
              {getUnitName(toUnit)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#00539C",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  categoryButtonsContainer: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedCategoryButton: {
    backgroundColor: "#00539C",
    borderColor: "#00539C",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#333",
  },
  selectedCategoryButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  conversionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  unitContainer: {
    flex: 1,
  },
  unitScrollView: {
    maxHeight: 150,
    marginBottom: 10,
  },
  unitButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedUnitButton: {
    backgroundColor: "#e6f2ff",
    borderColor: "#00539C",
  },
  unitButtonText: {
    fontSize: 14,
    color: "#333",
  },
  selectedUnitButtonText: {
    color: "#00539C",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  resultDisplay: {
    justifyContent: "center",
    backgroundColor: "#f0f8ff",
    borderColor: "#b0e0e6",
    minHeight: 46,
  },
  resultText: {
    fontSize: 16,
    color: "#00539C",
    fontWeight: "500",
  },
  swapButton: {
    width: 40,
    height: 40,
    backgroundColor: "#00539C",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    alignSelf: "center",
    marginTop: 75,
  },
  swapButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  formulaContainer: {
    padding: 12,
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    alignItems: "center",
  },
  formulaText: {
    fontSize: 16,
    color: "#333",
  },
});

export default ConverterScreen;
