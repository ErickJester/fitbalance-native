import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, radius } from "../components/theme";
import { getTips, getRecetas, MOMENTO_LABEL } from "../logic/knowledge";

const GOAL_LABEL = {
  lose: "Déficit de",
  muscle: "Superávit de",
  maintain: "Balance",
  health: "Déficit de",
};

export default function StepPlan({ plan, routine, data, onReset }) {
  const [recetaAbierta, setRecetaAbierta] = useState(null);

  const tips    = getTips(data.goal, data.dietStyle, 3);
  const recetas = getRecetas(data.goal, data.dietStyle, 3);

  const diff = Math.abs(plan.target - plan.tdee);
  const diffLabel = data.goal === "maintain"
    ? "TDEE exacto"
    : `${GOAL_LABEL[data.goal]} ${diff} kcal/día`;

  const proteinPct = Math.round((plan.protein * 4 / plan.target) * 100);
  const carbsPct   = Math.round((plan.carbs * 4 / plan.target) * 100);
  const fatPct     = Math.round((plan.fat * 9 / plan.target) * 100);

  return (
    <View>
      {/* ── Hero card ── */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Calorías objetivo diarias</Text>
        <Text style={styles.heroCal}>
          {plan.target.toLocaleString()} <Text style={styles.heroCalUnit}>kcal</Text>
        </Text>
        <Text style={styles.heroSub}>
          TDEE: {plan.tdee.toLocaleString()} kcal · {diffLabel}
        </Text>
        <View style={styles.heroRow}>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillVal}>{plan.protein}g</Text>
            <Text style={styles.heroPillLbl}>Proteína</Text>
          </View>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillVal}>{plan.carbs}g</Text>
            <Text style={styles.heroPillLbl}>Carbos</Text>
          </View>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillVal}>{plan.fat}g</Text>
            <Text style={styles.heroPillLbl}>Grasas</Text>
          </View>
        </View>
      </View>

      {/* ── Macros ── */}
      <View style={styles.whiteCard}>
        <Text style={styles.cardTitle}>Distribución de macros</Text>
        <View style={styles.macrosRow}>
          <View style={styles.macroItem}>
            <Text style={styles.macroVal}>{plan.protein}g</Text>
            <View style={styles.macroBarWrap}>
              <View style={[styles.macroBar, { width: `${Math.min(proteinPct / carbsPct * 100, 100)}%`, backgroundColor: colors.primary }]} />
            </View>
            <Text style={styles.macroLbl}>Proteína</Text>
            <Text style={styles.macroG}>{plan.protein * 4} kcal · {proteinPct}%</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroVal}>{plan.carbs}g</Text>
            <View style={styles.macroBarWrap}>
              <View style={[styles.macroBar, { width: "100%", backgroundColor: colors.primaryDark }]} />
            </View>
            <Text style={styles.macroLbl}>Carbos</Text>
            <Text style={styles.macroG}>{plan.carbs * 4} kcal · {carbsPct}%</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroVal}>{plan.fat}g</Text>
            <View style={styles.macroBarWrap}>
              <View style={[styles.macroBar, { width: `${Math.min(fatPct / carbsPct * 100, 100)}%`, backgroundColor: colors.primaryMuted }]} />
            </View>
            <Text style={styles.macroLbl}>Grasas</Text>
            <Text style={styles.macroG}>{plan.fat * 9} kcal · {fatPct}%</Text>
          </View>
        </View>
      </View>

      {/* ── Balance ── */}
      <View style={styles.whiteCard}>
        <Text style={styles.cardTitle}>Balance</Text>
        <BarRow label="Calidad de dieta" pct={plan.dietScore} />
        <BarRow label="Actividad física" pct={plan.gymScore} />
        <View style={styles.notesWrap}>
          <View style={styles.noteRow}>
            <View style={styles.noteDot} />
            <Text style={styles.noteText}>{plan.dietNote}</Text>
          </View>
          <View style={styles.noteRow}>
            <View style={styles.noteDot} />
            <Text style={styles.noteText}>{plan.gymNote}</Text>
          </View>
        </View>
      </View>

      {/* ── Rutina ── */}
      <View style={styles.whiteCard}>
        <Text style={styles.cardTitle}>
          Rutina semanal · {routine.length} {routine.length === 1 ? "día" : "días"}
        </Text>
        {routine.length === 0 ? (
          <Text style={styles.emptyText}>Sin días de gym. Considera caminatas de 30 min diarios.</Text>
        ) : (
          routine.map((r, i) => (
            <View key={i}>
              {i > 0 && <View style={styles.diaDivider} />}
              <View style={styles.diaRow}>
                <View style={styles.diaHeader}>
                  <View style={styles.diaBadge}>
                    <Text style={styles.diaBadgeText}>Día {i + 1}</Text>
                  </View>
                  <Text style={styles.diaName}>{r.day}</Text>
                </View>
                <View style={styles.ejercList}>
                  {r.blocks.map((b, j) =>
                    b.items.map((item, k) => (
                      <View key={`${j}-${k}`} style={styles.ejercItem}>
                        <View style={styles.ejercDot} />
                        <Text style={styles.ejercText}>{item}</Text>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {/* ── Consejos ── */}
      <View style={styles.whiteCard}>
        <Text style={styles.cardTitle}>Consejos para ti</Text>
        {tips.map((tip, i) => (
          <View key={tip.id}>
            {i > 0 && <View style={styles.tipDivider} />}
            <View style={styles.tipRow}>
              <View style={styles.tipTitle}>
                <View style={styles.tipIconDot} />
                <Text style={styles.tipTitleText}>{tip.titulo}</Text>
              </View>
              <Text style={styles.tipBody}>{tip.cuerpo}</Text>
              <Text style={styles.tipSrc}>{tip.fuente}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ── Recetas ── */}
      <View style={styles.whiteCard}>
        <Text style={[styles.cardTitle, styles.recetasTitle]}>Recetas sugeridas</Text>
        {recetas.map((r, i) => {
          const abierta = recetaAbierta === r.id;
          return (
            <View key={r.id}>
              <TouchableOpacity
                style={[styles.recetaRow, i === 0 && { paddingTop: 0 }]}
                onPress={() => setRecetaAbierta(abierta ? null : r.id)}
                activeOpacity={0.7}
              >
                <View style={styles.recetaHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recetaName}>{r.nombre}</Text>
                    <Text style={styles.recetaMeta}>
                      {MOMENTO_LABEL[r.momento]} · {r.tiempo_prep_min} min · {r.calorias} kcal
                    </Text>
                  </View>
                  <Text style={styles.recetaChevron}>{abierta ? "▲" : "▼"}</Text>
                </View>
                <View style={styles.macroPills}>
                  <View style={styles.mpill}><Text style={styles.mpillText}>P <Text style={styles.mpillVal}>{r.macros.proteina}g</Text></Text></View>
                  <View style={styles.mpill}><Text style={styles.mpillText}>C <Text style={styles.mpillVal}>{r.macros.carbos}g</Text></Text></View>
                  <View style={styles.mpill}><Text style={styles.mpillText}>G <Text style={styles.mpillVal}>{r.macros.grasas}g</Text></Text></View>
                </View>
              </TouchableOpacity>
              {abierta && (
                <View style={styles.recetaDetail}>
                  <Text style={styles.detailLabel}>INGREDIENTES</Text>
                  {r.ingredientes.map((ing, k) => (
                    <Text key={k} style={styles.detailText}>• {ing}</Text>
                  ))}
                  <Text style={[styles.detailLabel, { marginTop: 8 }]}>PREPARACIÓN</Text>
                  <Text style={styles.detailText}>{r.preparacion}</Text>
                </View>
              )}
              {i < recetas.length - 1 && <View style={styles.recetaDivider} />}
            </View>
          );
        })}
      </View>

      {/* ── Reset ── */}
      <TouchableOpacity style={styles.resetBtn} onPress={onReset} activeOpacity={0.7}>
        <Text style={styles.resetText}>Volver a empezar</Text>
      </TouchableOpacity>
    </View>
  );
}

function BarRow({ label, pct }) {
  return (
    <View style={styles.barRow}>
      <View style={styles.barHeader}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barPct}>{Math.round(pct)}%</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.min(pct, 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Hero
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 10,
    gap: 4,
  },
  heroLabel: {
    fontSize: 12,
    color: colors.primaryMuted,
  },
  heroCal: {
    fontSize: 36,
    fontWeight: "500",
    color: "#ffffff",
    letterSpacing: -1,
  },
  heroCalUnit: {
    fontSize: 16,
    fontWeight: "400",
  },
  heroSub: {
    fontSize: 12,
    color: colors.primaryMuted,
  },
  heroRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  heroPill: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
  },
  heroPillVal: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
  },
  heroPillLbl: {
    fontSize: 10,
    color: colors.primaryMuted,
  },
  // White cards
  whiteCard: {
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  // Macros
  macrosRow: {
    flexDirection: "row",
    gap: 8,
  },
  macroItem: {
    flex: 1,
    gap: 6,
  },
  macroVal: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  macroBarWrap: {
    height: 6,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 99,
    overflow: "hidden",
  },
  macroBar: {
    height: "100%",
    borderRadius: 99,
  },
  macroLbl: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  macroG: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  // Balance bars
  barRow: {
    marginBottom: 12,
    gap: 5,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  barLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  barPct: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  barTrack: {
    height: 6,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 99,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 99,
  },
  notesWrap: {
    gap: 6,
    marginTop: 2,
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  noteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 5,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  // Rutina
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  diaRow: {
    gap: 6,
  },
  diaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  diaBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  diaBadgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.primaryDark,
  },
  diaName: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textPrimary,
    flex: 1,
  },
  diaDivider: {
    height: 0.5,
    backgroundColor: colors.backgroundSecondary,
    marginVertical: 10,
  },
  ejercList: {
    gap: 3,
    paddingLeft: 4,
  },
  ejercItem: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  ejercDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: 6,
  },
  ejercText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
  },
  // Tips
  tipRow: {
    gap: 4,
    paddingVertical: 10,
  },
  tipDivider: {
    height: 0.5,
    backgroundColor: colors.backgroundSecondary,
  },
  tipTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tipIconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  tipTitleText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  tipBody: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  tipSrc: {
    fontSize: 10,
    color: "#b0b0aa",
  },
  // Recetas
  recetasTitle: {
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.backgroundSecondary,
  },
  recetaRow: {
    paddingVertical: 10,
  },
  recetaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  recetaName: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  recetaMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  recetaChevron: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  macroPills: {
    flexDirection: "row",
    gap: 6,
    marginTop: 7,
  },
  mpill: {
    backgroundColor: colors.background,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  mpillText: {
    fontSize: 11,
    color: colors.textPrimary,
  },
  mpillVal: {
    fontWeight: "500",
    color: colors.primary,
  },
  recetaDetail: {
    marginTop: 8,
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    padding: 10,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  recetaDivider: {
    height: 0.5,
    backgroundColor: colors.backgroundSecondary,
  },
  // Reset
  resetBtn: {
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 13,
    alignItems: "center",
    marginBottom: 24,
  },
  resetText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
});
