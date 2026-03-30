import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radius } from "./theme";

export default function MiniMetrics({ items }) {
  return (
    <View style={styles.row}>
      {items.map((item, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.val}>{item.value}</Text>
          <Text style={styles.lbl}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 2,
  },
  val: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.primary,
  },
  lbl: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
