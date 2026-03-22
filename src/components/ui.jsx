import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { colors, radius } from "./theme";

export const Label = ({ children }) => (
  <Text style={styles.label}>{children}</Text>
);

export const Field = ({ children }) => (
  <View style={styles.field}>{children}</View>
);

export const Input = ({ value, onChange, placeholder, keyboardType = "numeric" }) => (
  <TextInput
    style={styles.input}
    value={value}
    onChangeText={onChange}
    placeholder={placeholder}
    placeholderTextColor={colors.textSecondary}
    keyboardType={keyboardType}
  />
);

export const ChoiceBtn = ({ selected, onPress, children }) => (
  <TouchableOpacity
    style={[styles.choiceBtn, selected && styles.choiceBtnSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.choiceLabel, selected && styles.choiceLabelSelected]}>
      {children}
    </Text>
  </TouchableOpacity>
);

export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export const MetricCard = ({ label, value, unit, color }) => (
  <View style={styles.metricCard}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={[styles.metricValue, color ? { color } : {}]}>
      {value}
      <Text style={styles.metricUnit}> {unit}</Text>
    </Text>
  </View>
);

export const BarRow = ({ label, pct }) => (
  <View style={styles.barRow}>
    <View style={styles.barRowHeader}>
      <Text style={styles.barRowLabel}>{label}</Text>
      <Text style={styles.barRowPct}>{Math.round(pct)}%</Text>
    </View>
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.min(pct, 100)}%` }]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  field: {
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.textPrimary,
    fontSize: 14,
  },
  choiceBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginBottom: 4,
  },
  choiceBtnSelected: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  choiceLabel: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  choiceLabelSelected: {
    color: colors.primaryDark,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 14,
  },
  metricCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.md,
    padding: 12,
    alignItems: "center",
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    textAlign: "center",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: "400",
  },
  barRow: {
    marginBottom: 10,
  },
  barRowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  barRowLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  barRowPct: {
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
