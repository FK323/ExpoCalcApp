//Imad Rana
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import Svg, {
  Line,
  Path,
  Text as SvgText,
  Circle,
} from "react-native-svg";
import {
  GraphSettings,
  GraphFunction,
  initialGraphSettings,
  generatePoints,
  addFunction,
  updateFunction,
  removeFunction,
  updateRange,
  resetGraph,
  calculateTicks,
  graphToScreenX,
  graphToScreenY,
  formatNumber,
} from "../utils/graphLogic";

const GraphScreen: React.FC = () => {
  // State management
  const [settings, setSettings] = useState<GraphSettings>(initialGraphSettings);
  const [activeFunction, setActiveFunction] = useState<string | null>(null);
  const [editingExpression, setEditingExpression] = useState<string>("");
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get("window").width - 40, // Accounting for padding
    height: 300,
  });
  
  // References
  const svgRef = useRef<View>(null);
  const expressionInputRef = useRef<TextInput>(null);
  
  // Update active function when settings change
  useEffect(() => {
    if (settings.functions.length > 0 && !activeFunction) {
      setActiveFunction(settings.functions[0].id);
      setEditingExpression(settings.functions[0].expression);
    } else if (
      activeFunction &&
      !settings.functions.find((f) => f.id === activeFunction)
    ) {
      // If active function was deleted, select the first one
      if (settings.functions.length > 0) {
        setActiveFunction(settings.functions[0].id);
        setEditingExpression(settings.functions[0].expression);
      } else {
        setActiveFunction(null);
        setEditingExpression("");
      }
    }
  }, [settings.functions, activeFunction]);
  
  // Function handlers
  const handleAddFunction = () => {
    setSettings(addFunction(settings));
  };
  
  const handleRemoveFunction = (id: string) => {
    if (settings.functions.length <= 1) {
      Alert.alert(
        "Cannot Remove",
        "You must have at least one function.",
        [{ text: "OK" }]
      );
      return;
    }
    setSettings(removeFunction(settings, id));
  };
  
  const handleUpdateExpression = () => {
    if (!activeFunction) return;
    
    setSettings(
      updateFunction(settings, activeFunction, {
        expression: editingExpression,
      })
    );
  };
  
  const handleToggleVisibility = (id: string) => {
    const func = settings.functions.find((f) => f.id === id);
    if (func) {
      setSettings(
        updateFunction(settings, id, { isVisible: !func.isVisible })
      );
    }
  };
  
  const handleSelectFunction = (id: string) => {
    setActiveFunction(id);
    const func = settings.functions.find((f) => f.id === id);
    if (func) {
      setEditingExpression(func.expression);
    }
  };
  
  const handleUpdateRange = (field: keyof GraphSettings["range"], value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setSettings(updateRange(settings, { [field]: numValue }));
    }
  };
  
  const handleResetGraph = () => {
    setSettings(resetGraph());
  };
  
  // Generate path data for a function
  const generatePathData = (func: GraphFunction): string => {
    const { expression, isVisible } = func;
    
    if (!isVisible) return "";
    
    const points = generatePoints(expression, settings.range);
    let pathData = "";
    let lastValidY: number | null = null;
    
    points.forEach(({ x, y }, index) => {
      const screenX = graphToScreenX(x, dimensions.width, settings.range);
      
      if (y === null) {
        lastValidY = null;
        return;
      }
      
      // Don't plot points outside the y-range
      if (y < settings.range.yMin || y > settings.range.yMax) {
        lastValidY = null;
        return;
      }
      
      const screenY = graphToScreenY(y, dimensions.height, settings.range);
      
      if (lastValidY === null || index === 0) {
        pathData += `M ${screenX} ${screenY} `;
      } else {
        pathData += `L ${screenX} ${screenY} `;
      }
      
      lastValidY = y;
    });
    
    return pathData;
  };
  
  // Render functions
  const renderGrid = () => {
    const { range, gridStep } = settings;
    const { width, height } = dimensions;
    
    // Calculate tick marks
    const xTicks = calculateTicks(range.xMin, range.xMax, gridStep);
    const yTicks = calculateTicks(range.yMin, range.yMax, gridStep);
    
    // Grid lines and labels
    return (
      <>
        {/* X-axis */}
        <Line
          x1={0}
          y1={graphToScreenY(0, height, range)}
          x2={width}
          y2={graphToScreenY(0, height, range)}
          stroke="#000"
          strokeWidth={1}
        />
        
        {/* Y-axis */}
        <Line
          x1={graphToScreenX(0, width, range)}
          y1={0}
          x2={graphToScreenX(0, width, range)}
          y2={height}
          stroke="#000"
          strokeWidth={1}
        />
        
        {/* X-axis grid lines and labels */}
        {xTicks.map((tick) => {
          const x = graphToScreenX(tick, width, range);
          
          // Skip origin for cleaner look
          if (tick === 0) return null;
          
          return (
            <React.Fragment key={`x-${tick}`}>
              <Line
                x1={x}
                y1={0}
                x2={x}
                y2={height}
                stroke="#ddd"
                strokeWidth={0.5}
              />
              <SvgText
                x={x}
                y={graphToScreenY(0, height, range) + 15}
                fontSize="10"
                textAnchor="middle"
                fill="#666"
              >
                {formatNumber(tick)}
              </SvgText>
            </React.Fragment>
          );
        })}
        
        {/* Y-axis grid lines and labels */}
        {yTicks.map((tick) => {
          const y = graphToScreenY(tick, height, range);
          
          // Skip origin for cleaner look
          if (tick === 0) return null;
          
          return (
            <React.Fragment key={`y-${tick}`}>
              <Line
                x1={0}
                y1={y}
                x2={width}
                y2={y}
                stroke="#ddd"
                strokeWidth={0.5}
              />
              <SvgText
                x={graphToScreenX(0, width, range) - 8}
                y={y + 4}
                fontSize="10"
                textAnchor="end"
                fill="#666"
              >
                {formatNumber(tick)}
              </SvgText>
            </React.Fragment>
          );
        })}
        
        {/* Origin label */}
        <SvgText
          x={graphToScreenX(0, width, range) - 5}
          y={graphToScreenY(0, height, range) + 15}
          fontSize="10"
          textAnchor="end"
          fill="#666"
        >
          0
        </SvgText>
      </>
    );
  };
  
  // Render function curves
  const renderFunctions = () => {
    return settings.functions.map((func) => {
      if (!func.isVisible) return null;
      
      const pathData = generatePathData(func);
      
      return (
        <Path
          key={func.id}
          d={pathData}
          stroke={func.color}
          strokeWidth={2}
          fill="none"
        />
      );
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Graphing Calculator</Text>
          
          {/* Graph View */}
          <View 
            style={styles.graphContainer}
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              setDimensions({ width, height });
            }}
            ref={svgRef}
          >
            <Svg width={dimensions.width} height={dimensions.height}>
              {renderGrid()}
              {renderFunctions()}
            </Svg>
          </View>
          
          {/* Function Controls */}
          <View style={styles.functionControls}>
            <Text style={styles.sectionTitle}>Functions</Text>
            
            {/* Function Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.functionTabsContainer}>
                {settings.functions.map((func) => (
                  <TouchableOpacity
                    key={func.id}
                    style={[
                      styles.functionTab,
                      activeFunction === func.id && styles.activeFunctionTab,
                      !func.isVisible && styles.hiddenFunctionTab,
                    ]}
                    onPress={() => handleSelectFunction(func.id)}
                  >
                    <Text 
                      style={[
                        styles.functionTabText,
                        activeFunction === func.id && styles.activeFunctionTabText,
                        !func.isVisible && styles.hiddenFunctionTabText,
                      ]}
                      numberOfLines={1}
                    >
                      y = {func.expression}
                    </Text>
                  </TouchableOpacity>
                ))}
                
                <TouchableOpacity
                  style={styles.addFunctionButton}
                  onPress={handleAddFunction}
                >
                  <Text style={styles.addFunctionButtonText}>+ Add</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            
            {/* Function Editor */}
            {activeFunction && (
              <View style={styles.functionEditor}>
                <View style={styles.expressionInputContainer}>
                  <Text style={styles.expressionLabel}>y = </Text>
                  <TextInput
                    style={styles.expressionInput}
                    value={editingExpression}
                    onChangeText={setEditingExpression}
                    onEndEditing={handleUpdateExpression}
                    placeholder="Enter function (e.g., x^2, sin(x))"
                    returnKeyType="done"
                    ref={expressionInputRef}
                  />
                </View>
                
                {/* Function Action Buttons */}
                <View style={styles.functionActions}>
                  <TouchableOpacity
                    style={styles.functionActionButton}
                    onPress={() => handleUpdateExpression()}
                  >
                    <Text style={styles.functionActionButtonText}>Apply</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.functionActionButton}
                    onPress={() => 
                      handleToggleVisibility(activeFunction)
                    }
                  >
                    <Text style={styles.functionActionButtonText}>
                      {settings.functions.find(f => f.id === activeFunction)?.isVisible 
                        ? "Hide" 
                        : "Show"}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.functionActionButton, styles.dangerButton]}
                    onPress={() => handleRemoveFunction(activeFunction)}
                  >
                    <Text style={styles.functionActionButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          
          {/* Graph Settings */}
          <View style={styles.settingsSection}>
            <TouchableOpacity
              style={styles.settingsToggle}
              onPress={() => setShowSettings(!showSettings)}
            >
              <Text style={styles.sectionTitle}>Graph Settings</Text>
              <Text style={styles.toggleIcon}>{showSettings ? "▲" : "▼"}</Text>
            </TouchableOpacity>
            
            {showSettings && (
              <View style={styles.settingsContent}>
                <View style={styles.rangeInputRow}>
                  <View style={styles.rangeInputContainer}>
                    <Text style={styles.rangeLabel}>X Min:</Text>
                    <TextInput
                      style={styles.rangeInput}
                      value={settings.range.xMin.toString()}
                      onChangeText={(value) => handleUpdateRange("xMin", value)}
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={styles.rangeInputContainer}>
                    <Text style={styles.rangeLabel}>X Max:</Text>
                    <TextInput
                      style={styles.rangeInput}
                      value={settings.range.xMax.toString()}
                      onChangeText={(value) => handleUpdateRange("xMax", value)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                
                <View style={styles.rangeInputRow}>
                  <View style={styles.rangeInputContainer}>
                    <Text style={styles.rangeLabel}>Y Min:</Text>
                    <TextInput
                      style={styles.rangeInput}
                      value={settings.range.yMin.toString()}
                      onChangeText={(value) => handleUpdateRange("yMin", value)}
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={styles.rangeInputContainer}>
                    <Text style={styles.rangeLabel}>Y Max:</Text>
                    <TextInput
                      style={styles.rangeInput}
                      value={settings.range.yMax.toString()}
                      onChangeText={(value) => handleUpdateRange("yMax", value)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleResetGraph}
                >
                  <Text style={styles.resetButtonText}>Reset Graph</Text>
                </TouchableOpacity>
              </View>
            )}
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
  graphContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#f9f9f9",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  functionControls: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  functionTabsContainer: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  functionTab: {
    padding: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    maxWidth: 120,
  },
  activeFunctionTab: {
    backgroundColor: "#00539C",
    borderColor: "#00539C",
  },
  hiddenFunctionTab: {
    opacity: 0.5,
  },
  functionTabText: {
    fontSize: 14,
    color: "#333",
  },
  activeFunctionTabText: {
    color: "#fff",
    fontWeight: "500",
  },
  hiddenFunctionTabText: {
    fontStyle: "italic",
  },
  addFunctionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#e6f2ff",
    borderWidth: 1,
    borderColor: "#00539C",
  },
  addFunctionButtonText: {
    fontSize: 14,
    color: "#00539C",
  },
  functionEditor: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  expressionInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  expressionLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 4,
  },
  expressionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    backgroundColor: "#fff",
  },
  functionActions: {
    flexDirection: "row",
  },
  functionActionButton: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#00539C",
    alignItems: "center",
    marginHorizontal: 4,
  },
  dangerButton: {
    backgroundColor: "#ff3b30",
  },
  functionActionButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  settingsSection: {
    marginTop: 8,
  },
  settingsToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  toggleIcon: {
    fontSize: 16,
    color: "#00539C",
  },
  settingsContent: {
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  rangeInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  rangeInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  rangeLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  rangeInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    backgroundColor: "#fff",
  },
  resetButton: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#c0c0c0",
    alignItems: "center",
    marginTop: 8,
  },
  resetButtonText: {
    color: "#333",
    fontWeight: "500",
  },
});

export default GraphScreen;