import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "./theme";

export default function BarRow({ label, pct }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.pct}>{Math.round(pct)}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(pct, 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  pct: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  track: {
    height: 6,
    borderRadius: 99,
    backgroundColor: colors.backgroundSecondary,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 99,
  },
});
