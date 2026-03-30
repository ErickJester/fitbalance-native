import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getEquipmentStats } from "../logic/routineBuilder";
import { colors, radius } from "../components/theme";
import HeaderCard from "../components/HeaderCard";
import MiniMetrics from "../components/MiniMetrics";

const GRUPO_LABEL = {
  pecho: "Pecho", espalda: "Espalda", hombros: "Hombros",
  biceps: "Bíceps", triceps: "Tríceps", cuadriceps: "Cuádriceps",
  isquiotibiales: "Isquios", gluteos: "Glúteos", gemelos: "Gemelos",
  core: "Core", trapecio: "Trapecio", lumbar: "Lumbar",
  aductores: "Aductores", abductores: "Abductores",
};

export default function StepEquipment({ exercises, equipmentData, selectedEquipment, onToggle, onSelectAll, onClearAll }) {
  const [expandedCat, setExpandedCat] = useState(null);
  const stats = getEquipmentStats({ exercises, selectedEquipment, equipmentData });

  const metrics = [
    { value: String(selectedEquipment.length), label: "equipos\nseleccionados" },
    { value: String(stats.totalEjercicios), label: "ejercicios\ndisponibles" },
    { value: String(stats.gruposCubiertos.length), label: "grupos\nmusculares" },
  ];

  return (
    <View>
      <HeaderCard icon="✅" title="Tu equipamiento" subtitle="Paso 4 de 5 — ¿qué tienes en tu gym?" />
      <MiniMetrics items={metrics} />

      {/* Quick actions */}
      <View style={styles.quickRow}>
        <TouchableOpacity style={styles.btnAll} onPress={onSelectAll} activeOpacity={0.7}>
          <Text style={styles.btnAllText}>Seleccionar todo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnClear} onPress={onClearAll} activeOpacity={0.7}>
          <Text style={styles.btnClearText}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      {/* Categorías */}
      {equipmentData.categorias.map(cat => {
        const isOpen = expandedCat === cat.id;
        const selectedInCat = cat.equipos.filter(e => selectedEquipment.includes(e.id)).length;
        const allInCat = selectedInCat === cat.equipos.length;

        return (
          <View key={cat.id} style={styles.catCard}>
            <TouchableOpacity
              style={styles.catHeader}
              onPress={() => setExpandedCat(isOpen ? null : cat.id)}
              activeOpacity={0.7}
            >
              <View style={styles.catLeft}>
                <Text style={styles.catEmoji}>{cat.icono}</Text>
                <View>
                  <Text style={styles.catName}>{cat.nombre}</Text>
                  <Text style={styles.catCount}>{selectedInCat} / {cat.equipos.length} seleccionados</Text>
                </View>
              </View>
              <View style={styles.catRight}>
                {selectedInCat > 0 && (
                  <View style={styles.catBadge}>
                    <Text style={styles.catBadgeText}>{selectedInCat}</Text>
                  </View>
                )}
                <Text style={styles.chevron}>{isOpen ? "▲" : "▼"}</Text>
              </View>
            </TouchableOpacity>

            {isOpen && (
              <View style={styles.catBody}>
                <TouchableOpacity
                  style={styles.catSelAll}
                  onPress={() => {
                    const ids = cat.equipos.map(e => e.id);
                    allInCat
                      ? ids.forEach(id => onToggle(id, false))
                      : ids.forEach(id => onToggle(id, true));
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.catSelAllText}>
                    {allInCat ? "Deseleccionar categoría" : "Seleccionar categoría"}
                  </Text>
                </TouchableOpacity>

                {cat.equipos.map(equipo => {
                  const on = selectedEquipment.includes(equipo.id);
                  return (
                    <TouchableOpacity
                      key={equipo.id}
                      style={[styles.equipoRow, on && styles.equipoRowOn]}
                      onPress={() => onToggle(equipo.id, !on)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.checkbox, on && styles.checkboxOn]}>
                        {on && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <View style={styles.equipoInfo}>
                        <Text style={[styles.equipoName, on && styles.equipoNameOn]}>{equipo.nombre}</Text>
                        {equipo.grupos.length > 0 && (
                          <Text style={styles.equipoGrupos} numberOfLines={1}>
                            {equipo.grupos.map(g => GRUPO_LABEL[g] || g).join(" · ")}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}

      {/* Tip */}
      {selectedEquipment.length === 0 && (
        <View style={styles.tipBox}>
          <Text style={styles.tipIcon}>ℹ️</Text>
          <Text style={styles.tipText}>
            Sin equipamiento generaremos una rutina de peso corporal personalizada para ti.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Quick actions
  quickRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  btnAll: {
    flex: 1,
    padding: 9,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  btnAllText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#ffffff",
  },
  btnClear: {
    flex: 1,
    padding: 9,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    alignItems: "center",
  },
  btnClearText: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  // Category card
  catCard: {
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: "hidden",
    marginBottom: 10,
  },
  catHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 13,
    paddingHorizontal: 14,
  },
  catLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  catEmoji: {
    fontSize: 18,
    width: 22,
  },
  catName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  catCount: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  catRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  catBadge: {
    backgroundColor: colors.primary,
    borderRadius: 99,
    paddingVertical: 2,
    paddingHorizontal: 8,
    minWidth: 20,
    alignItems: "center",
  },
  catBadgeText: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "500",
  },
  chevron: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  // Category body
  catBody: {
    borderTopWidth: 0.5,
    borderTopColor: colors.backgroundSecondary,
  },
  catSelAll: {
    padding: 9,
    paddingHorizontal: 14,
    backgroundColor: colors.inputBg,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.backgroundSecondary,
  },
  catSelAllText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.primary,
  },
  // Equipment row
  equipoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 11,
    paddingHorizontal: 14,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.background,
  },
  equipoRowOn: {
    backgroundColor: "#f0faf6",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  equipoInfo: {
    flex: 1,
  },
  equipoName: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  equipoNameOn: {
    color: colors.primaryDark,
    fontWeight: "500",
  },
  equipoGrupos: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  // Tip
  tipBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: 11,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  tipIcon: {
    fontSize: 14,
    marginTop: 1,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: colors.primaryDark,
    lineHeight: 18,
  },
});
