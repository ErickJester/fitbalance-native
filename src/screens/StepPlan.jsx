import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card, MetricCard, BarRow } from "../components/ui";
import { colors, radius } from "../components/theme";
import { getTips, getRecetas, MOMENTO_LABEL } from "../logic/knowledge";

export default function StepPlan({ plan, routine, data, onReset }) {
  const [recetaAbierta, setRecetaAbierta] = useState(null);

  const tips    = getTips(data.goal, data.dietStyle, 3);
  const recetas = getRecetas(data.goal, data.dietStyle, 3);

  return (
    <View>
      {/* ── Métricas ── */}
      <View style={styles.metricsGrid}>
        <MetricCard label="Calorías objetivo" value={plan.target.toLocaleString()} unit="kcal" color={colors.primary} />
        <MetricCard label="TDEE (gasto total)" value={plan.tdee.toLocaleString()} unit="kcal" />
        <MetricCard label="Proteína"       value={plan.protein} unit="g" />
        <MetricCard label="Carbohidratos"  value={plan.carbs}   unit="g" />
        <MetricCard label="Grasas"         value={plan.fat}     unit="g" />
        <MetricCard label="Cal. gym/sem"   value={plan.gymCalWeek.toLocaleString()} unit="kcal" />
      </View>

      {/* ── Balance ── */}
      <Card>
        <Text style={styles.cardTitle}>Balance</Text>
        <BarRow label="Calidad de dieta"  pct={plan.dietScore} />
        <BarRow label="Actividad física"  pct={plan.gymScore} />
        <View style={styles.notes}>
          <Text style={styles.note}>🥗 {plan.dietNote}</Text>
          <Text style={styles.note}>🏋️ {plan.gymNote}</Text>
        </View>
      </Card>

      {/* ── Consejos ── */}
      <Card>
        <Text style={styles.cardTitle}>Consejos para ti</Text>
        {tips.map((tip, i) => (
          <View key={tip.id} style={[styles.tipRow, i > 0 && styles.tipDivider]}>
            <Text style={styles.tipTitulo}>💡 {tip.titulo}</Text>
            <Text style={styles.tipCuerpo}>{tip.cuerpo}</Text>
            <Text style={styles.tipFuente}>{tip.fuente}</Text>
          </View>
        ))}
      </Card>

      {/* ── Recetas ── */}
      <Card>
        <Text style={styles.cardTitle}>Recetas sugeridas</Text>
        {recetas.map((r, i) => {
          const abierta = recetaAbierta === r.id;
          return (
            <View key={r.id} style={[styles.recetaRow, i > 0 && styles.tipDivider]}>
              <TouchableOpacity
                onPress={() => setRecetaAbierta(abierta ? null : r.id)}
                activeOpacity={0.7}
              >
                <View style={styles.recetaHeader}>
                  <View style={styles.recetaHeaderLeft}>
                    <Text style={styles.recetaNombre}>{r.nombre}</Text>
                    <Text style={styles.recetaMeta}>
                      {MOMENTO_LABEL[r.momento]}  ·  {r.tiempo_prep_min} min  ·  {r.calorias} kcal
                    </Text>
                  </View>
                  <Text style={styles.chevron}>{abierta ? "▲" : "▼"}</Text>
                </View>

                {/* Macros pill row */}
                <View style={styles.macroRow}>
                  <View style={styles.macroPill}>
                    <Text style={styles.macroPillLabel}>P</Text>
                    <Text style={styles.macroPillVal}>{r.macros.proteina}g</Text>
                  </View>
                  <View style={styles.macroPill}>
                    <Text style={styles.macroPillLabel}>C</Text>
                    <Text style={styles.macroPillVal}>{r.macros.carbos}g</Text>
                  </View>
                  <View style={styles.macroPill}>
                    <Text style={styles.macroPillLabel}>G</Text>
                    <Text style={styles.macroPillVal}>{r.macros.grasas}g</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Detalle expandible */}
              {abierta && (
                <View style={styles.recetaDetalle}>
                  <Text style={styles.detalleLabel}>Ingredientes</Text>
                  {r.ingredientes.map((ing, k) => (
                    <Text key={k} style={styles.blockItem}>• {ing}</Text>
                  ))}
                  <Text style={[styles.detalleLabel, { marginTop: 10 }]}>Preparación</Text>
                  <Text style={styles.preparacion}>{r.preparacion}</Text>
                </View>
              )}
            </View>
          );
        })}
      </Card>

      {/* ── Rutina ── */}
      <Card>
        <Text style={styles.cardTitle}>Rutina de gym personalizada</Text>
        {routine.length === 0 ? (
          <Text style={styles.noGym}>Sin días de gym configurados. Considera caminatas de 30 min diarios.</Text>
        ) : (
          routine.map((r, i) => (
            <View key={i} style={[styles.routineDay, i > 0 && styles.routineDivider]}>
              <Text style={styles.dayTitle}>{r.day}</Text>
              {r.blocks.map((b, j) => (
                <View key={j} style={styles.block}>
                  <Text style={styles.blockTitle}>{b.title}</Text>
                  {b.items.map((item, k) => (
                    <Text key={k} style={styles.blockItem}>• {item}</Text>
                  ))}
                </View>
              ))}
            </View>
          ))
        )}
      </Card>

      {/* ── Reset ── */}
      <TouchableOpacity style={styles.resetBtn} onPress={onReset} activeOpacity={0.7}>
        <Text style={styles.resetLabel}>Recalcular</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  notes: {
    marginTop: 10,
  },
  note: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  // Tips
  tipRow: {
    paddingVertical: 10,
  },
  tipDivider: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  tipTitulo: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  tipCuerpo: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  tipFuente: {
    fontSize: 11,
    color: colors.primary,
    fontStyle: "italic",
  },
  // Recetas
  recetaRow: {
    paddingVertical: 10,
  },
  recetaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  recetaHeaderLeft: {
    flex: 1,
  },
  recetaNombre: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  recetaMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  chevron: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 8,
    marginTop: 2,
  },
  macroRow: {
    flexDirection: "row",
    gap: 6,
  },
  macroPill: {
    flexDirection: "row",
    gap: 3,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  macroPillLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.primary,
  },
  macroPillVal: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  recetaDetalle: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.md,
  },
  detalleLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  preparacion: {
    fontSize: 13,
    color: "#1a1a1a",
    lineHeight: 20,
  },
  // Rutina
  noGym: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  routineDay: {
    marginBottom: 14,
  },
  routineDivider: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingTop: 14,
  },
  dayTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primaryDark,
    marginBottom: 10,
  },
  block: {
    marginBottom: 10,
  },
  blockTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  blockItem: {
    fontSize: 13,
    color: "#1a1a1a",
    lineHeight: 22,
  },
  resetBtn: {
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    marginBottom: 24,
    marginTop: 4,
  },
  resetLabel: {
    fontSize: 14,
    color: "#1a1a1a",
  },
});
