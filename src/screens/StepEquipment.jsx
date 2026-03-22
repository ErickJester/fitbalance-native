import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView
} from "react-native";
import { getEquipmentStats } from "../logic/routineBuilder";
import { colors, radius } from "../components/theme";

export default function StepEquipment({ exercises, equipmentData, selectedEquipment, onToggle, onSelectAll, onClearAll }) {
  const [expandedCat, setExpandedCat] = useState(null);
  const stats = getEquipmentStats({ exercises, selectedEquipment, equipmentData });

  const totalEquipos = equipmentData.categorias.reduce(
    (acc, cat) => acc + cat.equipos.length, 0
  );

  return (
    <View>
      {/* Header */}
      <Text style={styles.title}>¿Qué tienes en tu gym?</Text>
      <Text style={styles.subtitle}>
        Selecciona el equipamiento disponible. La rutina se armará solo con lo que tengas.
      </Text>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{selectedEquipment.length}</Text>
          <Text style={styles.statLabel}>de {totalEquipos} equipos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{stats.totalEjercicios}</Text>
          <Text style={styles.statLabel}>ejercicios disponibles</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{stats.gruposCubiertos.length}</Text>
          <Text style={styles.statLabel}>grupos musculares</Text>
        </View>
      </View>

      {/* Acciones rápidas */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickBtn} onPress={onSelectAll} activeOpacity={0.7}>
          <Text style={styles.quickBtnLabel}>Seleccionar todo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickBtn, styles.quickBtnOutline]} onPress={onClearAll} activeOpacity={0.7}>
          <Text style={[styles.quickBtnLabel, styles.quickBtnLabelOutline]}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      {/* Categorías */}
      {equipmentData.categorias.map(cat => {
        const isOpen = expandedCat === cat.id;
        const selectedInCat = cat.equipos.filter(e => selectedEquipment.includes(e.id)).length;
        const allInCat = selectedInCat === cat.equipos.length;

        return (
          <View key={cat.id} style={styles.categoryCard}>
            {/* Cabecera de categoría */}
            <TouchableOpacity
              style={styles.catHeader}
              onPress={() => setExpandedCat(isOpen ? null : cat.id)}
              activeOpacity={0.7}
            >
              <View style={styles.catHeaderLeft}>
                <Text style={styles.catIcon}>{cat.icono}</Text>
                <View>
                  <Text style={styles.catNombre}>{cat.nombre}</Text>
                  <Text style={styles.catCount}>
                    {selectedInCat}/{cat.equipos.length} seleccionados
                  </Text>
                </View>
              </View>
              <View style={styles.catHeaderRight}>
                {selectedInCat > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{selectedInCat}</Text>
                  </View>
                )}
                <Text style={styles.chevron}>{isOpen ? "▲" : "▼"}</Text>
              </View>
            </TouchableOpacity>

            {/* Lista de equipos */}
            {isOpen && (
              <View style={styles.equiposList}>
                {/* Seleccionar/limpiar categoría */}
                <TouchableOpacity
                  style={styles.catSelectAll}
                  onPress={() => {
                    const ids = cat.equipos.map(e => e.id);
                    allInCat ? ids.forEach(id => onToggle(id, false)) : ids.forEach(id => onToggle(id, true));
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.catSelectAllLabel}>
                    {allInCat ? "Deseleccionar categoría" : "Seleccionar categoría"}
                  </Text>
                </TouchableOpacity>

                {cat.equipos.map(equipo => {
                  const selected = selectedEquipment.includes(equipo.id);
                  return (
                    <TouchableOpacity
                      key={equipo.id}
                      style={[styles.equipoItem, selected && styles.equipoItemSelected]}
                      onPress={() => onToggle(equipo.id, !selected)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.equipoItemLeft}>
                        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                          {selected && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <View style={styles.equipoInfo}>
                          <Text style={[styles.equipoNombre, selected && styles.equipoNombreSelected]}>
                            {equipo.nombre}
                          </Text>
                          {equipo.grupos.length > 0 && (
                            <Text style={styles.equipoGrupos} numberOfLines={1}>
                              {equipo.grupos.map(g => GRUPO_LABEL[g] || g).join(" · ")}
                            </Text>
                          )}
                        </View>
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
          <Text style={styles.tipText}>
            💡 Sin equipamiento generaremos una rutina de peso corporal para ti.
          </Text>
        </View>
      )}
    </View>
  );
}

const GRUPO_LABEL = {
  pecho: "Pecho", espalda: "Espalda", hombros: "Hombros",
  biceps: "Bíceps", triceps: "Tríceps", cuadriceps: "Cuádriceps",
  isquiotibiales: "Isquios", gluteos: "Glúteos", gemelos: "Gemelos",
  core: "Core", trapecio: "Trapecio", lumbar: "Lumbar",
  aductores: "Aductores", abductores: "Abductores",
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  // Stats
  statsBar: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 12,
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNum: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 0.5,
    backgroundColor: colors.border,
  },
  // Quick actions
  quickActions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  quickBtn: {
    flex: 1,
    padding: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  quickBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  quickBtnLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#fff",
  },
  quickBtnLabelOutline: {
    color: colors.textSecondary,
  },
  // Categorías
  categoryCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginBottom: 10,
    overflow: "hidden",
  },
  catHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  catHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  catIcon: {
    fontSize: 22,
  },
  catNombre: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  catCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  catHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  chevron: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  // Lista equipos
  equiposList: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  catSelectAll: {
    padding: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
  },
  catSelectAllLabel: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
  equipoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  equipoItemSelected: {
    backgroundColor: colors.primaryLight,
  },
  equipoItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  equipoInfo: {
    flex: 1,
  },
  equipoNombre: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  equipoNombreSelected: {
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
    padding: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: colors.primaryDark,
    lineHeight: 20,
  },
});
