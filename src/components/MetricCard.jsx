import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radius } from "./theme";

export default function MetricCard({ label, value, unit, color }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, color ? { color } : null]}>
        {value}
        <Text style={styles.unit}> {unit}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.md,
    padding: 12,
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    textAlign: "center",
  },
  value: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  unit: {
    fontSize: 12,
    fontWeight: "400",
  },
});
