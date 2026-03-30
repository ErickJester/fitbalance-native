import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radius } from "./theme";

export default function HeaderCard({ icon, title, subtitle }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 10,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 12,
    color: colors.primaryMuted,
    marginTop: 2,
  },
});
