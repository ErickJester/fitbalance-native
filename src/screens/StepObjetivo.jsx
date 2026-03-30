import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, radius } from "../components/theme";
import HeaderCard from "../components/HeaderCard";

const GOALS = [
  {
    value: "lose",
    icon: "📉",
    name: "Perder grasa",
    desc: "Déficit calórico + cardio",
    tag: "−500 kcal/día",
    infoTitle: "Perder grasa",
    infoBody: "Reduciremos 500 kcal de tu TDEE diario. Priorizaremos cardio y circuitos de fuerza para preservar masa muscular mientras quemas grasa.",
    pills: ["Cardio + fuerza", "Alto en proteína", "Déficit −500 kcal"],
  },
  {
    value: "muscle",
    icon: "🏋️",
    name: "Ganar músculo",
    desc: "Superávit + fuerza",
    tag: "+250 kcal/día",
    infoTitle: "Ganar músculo",
    infoBody: "Sumaremos 250 kcal sobre tu TDEE. El plan enfatiza ejercicios de fuerza progresiva y una ingesta de proteína de 2g por kg de peso corporal.",
    pills: ["Fuerza progresiva", "2g proteína/kg", "Superávit +250 kcal"],
  },
  {
    value: "maintain",
    icon: "⚖️",
    name: "Mantenerme",
    desc: "Balance calórico",
    tag: "TDEE exacto",
    infoTitle: "Mantenerme",
    infoBody: "Comerás exactamente tu TDEE. El plan balancea sesiones de fuerza y cardio moderado para mantener composición corporal y energía estable.",
    pills: ["Fuerza + cardio", "Balance calórico", "TDEE exacto"],
  },
  {
    value: "health",
    icon: "❤️",
    name: "Mejorar salud",
    desc: "Bienestar general",
    tag: "−200 kcal/día",
    infoTitle: "Mejorar salud",
    infoBody: "Leve déficit de 200 kcal para optimizar composición corporal. El plan combina movilidad, fuerza ligera y hábitos de alimentación sostenibles.",
    pills: ["Movilidad", "Fuerza ligera", "Déficit −200 kcal"],
  },
];

export default function StepObjetivo({ data, set }) {
  const selected = GOALS.find(g => g.value === data.goal) || GOALS[0];

  return (
    <View>
      <HeaderCard icon="🎯" title="Tu objetivo" subtitle="Paso 3 de 5 — ¿qué quieres lograr?" />

      {/* Grid 2x2 */}
      <View style={styles.grid}>
        {GOALS.map(g => {
          const on = data.goal === g.value;
          return (
            <TouchableOpacity
              key={g.value}
              style={[styles.goalCard, on && styles.goalCardOn]}
              onPress={() => set("goal", g.value)}
              activeOpacity={0.7}
            >
              {/* Checkmark circle */}
              <View style={[styles.check, on && styles.checkOn]}>
                {on && <Text style={styles.checkmark}>✓</Text>}
              </View>

              <View style={[styles.goalIcon, on && styles.goalIconOn]}>
                <Text style={styles.goalEmoji}>{g.icon}</Text>
              </View>
              <View>
                <Text style={[styles.goalName, on && styles.goalNameOn]}>{g.name}</Text>
                <Text style={[styles.goalDesc, on && styles.goalDescOn]}>{g.desc}</Text>
              </View>
              <View style={[styles.goalTag, on && styles.goalTagOn]}>
                <Text style={[styles.goalTagText, on && styles.goalTagTextOn]}>{g.tag}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Info card */}
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <View style={styles.infoDot} />
          <Text style={styles.infoTitle}>{selected.infoTitle}</Text>
        </View>
        <Text style={styles.infoBody}>{selected.infoBody}</Text>
        <View style={styles.infoPills}>
          {selected.pills.map((p, i) => (
            <View key={i} style={styles.infoPill}>
              <Text style={styles.infoPillText}>{p}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  goalCard: {
    width: "48.5%",
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    paddingHorizontal: 14,
    gap: 10,
    position: "relative",
    overflow: "hidden",
  },
  goalCardOn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  check: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  checkOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  goalIconOn: {
    backgroundColor: colors.card,
  },
  goalEmoji: {
    fontSize: 20,
  },
  goalName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
    lineHeight: 18,
  },
  goalNameOn: {
    color: colors.primaryDark,
  },
  goalDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  goalDescOn: {
    color: colors.primaryDark,
  },
  goalTag: {
    alignSelf: "flex-start",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 99,
    backgroundColor: colors.backgroundSecondary,
  },
  goalTagOn: {
    backgroundColor: colors.primaryMuted,
  },
  goalTagText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  goalTagTextOn: {
    color: "#085041",
  },
  // Info card
  infoCard: {
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    gap: 10,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  infoBody: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  infoPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  infoPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 99,
    backgroundColor: colors.primaryLight,
  },
  infoPillText: {
    fontSize: 11,
    color: colors.primaryDark,
  },
});
