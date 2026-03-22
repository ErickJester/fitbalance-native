import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, radius } from "./theme";

export default function ChoiceBtn({ selected, onPress, children, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, selected && styles.selected, style]}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  selected: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  label: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  labelSelected: {
    color: colors.primaryDark,
    fontWeight: "500",
  },
});
