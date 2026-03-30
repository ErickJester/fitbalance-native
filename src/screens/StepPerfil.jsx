import React, { useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { colors, radius } from "../components/theme";
import HeaderCard from "../components/HeaderCard";
import MiniMetrics from "../components/MiniMetrics";

const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "Sedentario",  sub: "Sin ejercicio habitual" },
  { value: "light",     label: "Ligero",       sub: "1-2 días / semana" },
  { value: "moderate",  label: "Moderado",     sub: "3-4 días / semana" },
  { value: "active",    label: "Activo",       sub: "5-6 días / semana" },
  { value: "very",      label: "Muy activo",   sub: "Diario + trabajo físico" },
];

function calcIMC(weight, height) {
  const w = parseFloat(weight);
  const h = parseFloat(height);
  if (!w || !h || h === 0) return null;
  return w / ((h / 100) * (h / 100));
}

function imcLabel(imc) {
  if (imc < 18.5) return "Bajo peso";
  if (imc < 25)   return "Peso normal";
  if (imc < 30)   return "Sobrepeso";
  return "Obesidad";
}

export default function StepPerfil({ data, set }) {
  const imc = useMemo(() => calcIMC(data.weight, data.height), [data.weight, data.height]);

  const metrics = [
    { value: data.weight || "--", label: "kg" },
    { value: data.height || "--", label: "cm" },
    { value: imc ? imc.toFixed(1) : "--", label: "IMC" },
    { value: data.age || "--", label: "años" },
  ];

  return (
    <View>
      <HeaderCard icon="👤" title="Tu perfil" subtitle="Paso 1 de 5 — cuéntanos sobre ti" />
      <MiniMetrics items={metrics} />

      <View style={styles.card}>
        {/* Sexo toggle */}
        <View>
          <Text style={styles.sectionTitle}>SEXO</Text>
          <View style={styles.sexRow}>
            {[["m", "Hombre"], ["f", "Mujer"]].map(([v, l]) => (
              <TouchableOpacity
                key={v}
                style={[styles.sexBtn, data.sex === v && styles.sexBtnOn]}
                onPress={() => set("sex", v)}
                activeOpacity={0.7}
              >
                <Text style={[styles.sexLabel, data.sex === v && styles.sexLabelOn]}>
                  {v === "m" ? "♂ " : "♀ "}{l}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Datos físicos */}
        <View>
          <Text style={styles.sectionTitle}>DATOS FÍSICOS</Text>
          <View style={styles.inputsGrid}>
            <View style={styles.inpBlock}>
              <Text style={styles.inpLabel}>Edad</Text>
              <View style={styles.inpWrap}>
                <TextInput
                  style={styles.inp}
                  value={data.age}
                  onChangeText={v => set("age", v)}
                  keyboardType="numeric"
                  placeholder="28"
                  placeholderTextColor={colors.border}
                />
                <Text style={styles.inpUnit}>a</Text>
              </View>
            </View>
            <View style={styles.inpBlock}>
              <Text style={styles.inpLabel}>Peso</Text>
              <View style={styles.inpWrap}>
                <TextInput
                  style={styles.inp}
                  value={data.weight}
                  onChangeText={v => set("weight", v)}
                  keyboardType="numeric"
                  placeholder="75"
                  placeholderTextColor={colors.border}
                />
                <Text style={styles.inpUnit}>kg</Text>
              </View>
            </View>
            <View style={styles.inpBlock}>
              <Text style={styles.inpLabel}>Altura</Text>
              <View style={styles.inpWrap}>
                <TextInput
                  style={styles.inp}
                  value={data.height}
                  onChangeText={v => set("height", v)}
                  keyboardType="numeric"
                  placeholder="178"
                  placeholderTextColor={colors.border}
                />
                <Text style={styles.inpUnit}>cm</Text>
              </View>
            </View>
          </View>
        </View>

        {/* IMC badge */}
        {imc && (
          <View style={styles.imcRow}>
            <Text style={styles.imcLabel}>{imcLabel(imc)}</Text>
            <Text style={styles.imcVal}>IMC {imc.toFixed(1)}</Text>
          </View>
        )}

        {/* Actividad */}
        <View>
          <Text style={styles.sectionTitle}>NIVEL DE ACTIVIDAD</Text>
          <View style={styles.actGrid}>
            {ACTIVITY_OPTIONS.map(o => {
              const on = data.physicalActivity === o.value;
              return (
                <TouchableOpacity
                  key={o.value}
                  style={[styles.actBtn, on && styles.actBtnOn]}
                  onPress={() => set("physicalActivity", o.value)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.actDot, on && styles.actDotOn]} />
                  <View style={styles.actInfo}>
                    <Text style={[styles.actLabel, on && styles.actLabelOn]}>{o.label}</Text>
                    <Text style={[styles.actFreq, on && styles.actFreqOn]}>{o.sub}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 18,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  // Sex toggle
  sexRow: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  sexBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.inputBg,
  },
  sexBtnOn: {
    backgroundColor: colors.primary,
  },
  sexLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sexLabelOn: {
    color: "#ffffff",
    fontWeight: "500",
  },
  // Inputs grid
  inputsGrid: {
    flexDirection: "row",
    gap: 8,
  },
  inpBlock: {
    flex: 1,
    gap: 5,
  },
  inpLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  inpWrap: {
    position: "relative",
  },
  inp: {
    width: "100%",
    paddingVertical: 9,
    paddingLeft: 10,
    paddingRight: 28,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  inpUnit: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -7 }],
    fontSize: 11,
    color: colors.textSecondary,
  },
  // IMC badge
  imcRow: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imcLabel: {
    fontSize: 12,
    color: colors.primaryDark,
  },
  imcVal: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primaryDark,
  },
  // Activity
  actGrid: {
    gap: 6,
  },
  actBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
  },
  actBtnOn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  actDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  actDotOn: {
    backgroundColor: colors.primary,
  },
  actInfo: {
    flex: 1,
  },
  actLabel: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  actLabelOn: {
    color: colors.primaryDark,
    fontWeight: "500",
  },
  actFreq: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  actFreqOn: {
    color: colors.primaryDark,
  },
});
