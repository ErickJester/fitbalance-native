import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "./theme";

const STEPS = ["Perfil", "Rutina", "Objetivo", "Equipo", "Plan"];

export default function StepBar({ currentStep, onStepPress }) {
  return (
    <View style={styles.container}>
      {STEPS.map((label, i) => (
        <TouchableOpacity
          key={label}
          style={styles.step}
          onPress={() => i < currentStep && onStepPress?.(i)}
          activeOpacity={i < currentStep ? 0.7 : 1}
        >
          <View style={[styles.bar, i <= currentStep && styles.barActive]} />
          <Text style={[styles.label, i === currentStep && styles.labelActive]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 24,
  },
  step: {
    flex: 1,
    alignItems: "center",
  },
  bar: {
    height: 3,
    borderRadius: 99,
    backgroundColor: colors.backgroundSecondary,
    marginBottom: 5,
    width: "100%",
  },
  barActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.primaryDark,
    fontWeight: "500",
  },
});
