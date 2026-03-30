import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Slider from "../components/Slider";
import { colors, radius } from "../components/theme";
import HeaderCard from "../components/HeaderCard";
import MiniMetrics from "../components/MiniMetrics";

const DIET_OPTIONS = [
  { value: "excellent", label: "Muy saludable",           sub: "Sin procesados, mides tus macros" },
  { value: "good",      label: "Saludable",               sub: "Pocos procesados, cocinas en casa" },
  { value: "average",   label: "Promedio",                 sub: "Mixta, algún antojo el finde" },
  { value: "poor",      label: "Poco saludable",          sub: "Comida rápida frecuente" },
  { value: "junk",      label: "Alta en ultraprocesados", sub: "Fast food casi todos los días" },
];

function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export default function StepRutina({ data, set }) {
  const days = parseInt(data.gymDays) || 0;
  const mins = parseInt(data.gymMinutes) || 45;
  const total = days * mins;

  const metrics = [
    { value: String(days), label: "días/sem" },
    { value: String(mins), label: "min/sesión" },
    { value: String(total), label: "min/semana" },
  ];

  return (
    <View>
      <HeaderCard icon="📋" title="Tu rutina" subtitle="Paso 2 de 5 — cuéntanos tu ritmo" />
      <MiniMetrics items={metrics} />

      <View style={styles.card}>
        {/* Días de gym */}
        <View>
          <Text style={styles.sectionTitle}>DÍAS DE GYM POR SEMANA</Text>
          <View style={styles.daysRow}>
            {[0, 1, 2, 3, 4, 5, 6].map(d => {
              const on = data.gymDays === String(d);
              return (
                <TouchableOpacity
                  key={d}
                  style={[styles.dayBtn, on && styles.dayBtnOn]}
                  onPress={() => set("gymDays", String(d))}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dayLabel, on && styles.dayLabelOn]}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Minutos por sesión */}
        <View>
          <Text style={styles.sectionTitle}>MINUTOS POR SESIÓN</Text>
          <Slider
            value={mins}
            min={20}
            max={120}
            step={5}
            onChange={v => set("gymMinutes", String(v))}
          />
        </View>

        {/* Resumen semanal */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>Tiempo total{"\n"}en el gym por semana</Text>
          <Text style={styles.summaryVal}>{formatTime(total)}</Text>
        </View>

        {/* Calidad de dieta */}
        <View>
          <Text style={styles.sectionTitle}>CALIDAD DE TU DIETA ACTUAL</Text>
          <View style={styles.dietGrid}>
            {DIET_OPTIONS.map(o => {
              const on = data.dietStyle === o.value;
              return (
                <TouchableOpacity
                  key={o.value}
                  style={[styles.dietBtn, on && styles.dietBtnOn]}
                  onPress={() => set("dietStyle", o.value)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.dietDot, on && styles.dietDotOn]} />
                  <View style={styles.dietInfo}>
                    <Text style={[styles.dietLabel, on && styles.dietLabelOn]}>{o.label}</Text>
                    <Text style={[styles.dietSub, on && styles.dietSubOn]}>{o.sub}</Text>
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
  // Days
  daysRow: {
    flexDirection: "row",
    gap: 6,
  },
  dayBtn: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  dayBtnOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  dayLabelOn: {
    color: "#ffffff",
  },
  // Summary
  summaryCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryText: {
    fontSize: 12,
    color: colors.primaryDark,
    lineHeight: 18,
  },
  summaryVal: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.primary,
  },
  // Diet
  dietGrid: {
    gap: 6,
  },
  dietBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
  },
  dietBtnOn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  dietDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dietDotOn: {
    backgroundColor: colors.primary,
  },
  dietInfo: {
    flex: 1,
    gap: 1,
  },
  dietLabel: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  dietLabelOn: {
    color: colors.primaryDark,
    fontWeight: "500",
  },
  dietSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  dietSubOn: {
    color: colors.primaryDark,
  },
});
