import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import StepBar from "./src/components/StepBar";
import StepPerfil from "./src/screens/StepPerfil";
import StepRutina from "./src/screens/StepRutina";
import StepObjetivo from "./src/screens/StepObjetivo";
import StepEquipment from "./src/screens/StepEquipment";
import StepPlan from "./src/screens/StepPlan";
import { buildPlan } from "./src/logic/calculations";
import { buildRoutine } from "./src/logic/routineBuilder";
import { openDatabase, getAllExercises, saveUserPlan } from "./src/db/database";
import equipmentData from "./src/data/equipment.json";
import { colors, radius } from "./src/components/theme";

const INITIAL_DATA = {
  sex: "m",
  age: "",
  weight: "",
  height: "",
  physicalActivity: "moderate",
  dietStyle: "average",
  gymDays: "3",
  gymMinutes: "45",
  goal: "lose",
};

const ALL_EQUIPMENT_IDS = equipmentData.categorias.flatMap(cat =>
  cat.equipos.map(e => e.id)
);

// Steps: 0=Perfil 1=Rutina 2=Objetivo 3=Equipamiento 4=Plan
const TOTAL_STEPS = 5;

export default function App() {
  const [step, setStep]                   = useState(0);
  const [data, setData]                   = useState(INITIAL_DATA);
  const [plan, setPlan]                   = useState(null);
  const [routine, setRoutine]             = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [exercises, setExercises]         = useState([]);
  const [db, setDb]                       = useState(null);
  const [dbReady, setDbReady]             = useState(false);

  // ─── Inicializar base de datos al arrancar ───────────────────────────────
  useEffect(() => {
    async function initDB() {
      try {
        const db   = await openDatabase();
        const exs  = await getAllExercises(db);
        setDb(db);
        setExercises(exs);
      } catch (err) {
        console.error("Error iniciando base de datos:", err);
      } finally {
        setDbReady(true);
      }
    }
    initDB();
  }, []);

  const set = (key, value) => setData(prev => ({ ...prev, [key]: value }));

  const toggleEquipment = (id, value) => {
    setSelectedEquipment(prev =>
      value ? [...prev, id] : prev.filter(e => e !== id)
    );
  };

  const selectAllEquipment = () => setSelectedEquipment(ALL_EQUIPMENT_IDS);
  const clearAllEquipment  = () => setSelectedEquipment([]);

  const canNext = () => {
    if (step === 0) return data.age && data.weight && data.height;
    return true;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(s => s + 1);
      return;
    }
    // Step 3 → generar plan y rutina → ir a Step 4
    const p = buildPlan(data);
    const r = buildRoutine({
      exercises,
      selectedEquipment,
      equipmentData,
      goal:       data.goal,
      gymDays:    parseInt(data.gymDays)    || 3,
      gymMinutes: parseInt(data.gymMinutes) || 45,
    });
    setPlan(p);
    setRoutine(r);
    setStep(4);
    if (db) saveUserPlan(db, { ...data, selectedEquipment }, p, r).catch(console.error);
  };

  const handleBack  = () => setStep(s => s - 1);

  const handleReset = () => {
    setStep(0);
    setData(INITIAL_DATA);
    setPlan(null);
    setRoutine([]);
    setSelectedEquipment([]);
  };

  // ─── Pantalla de carga mientras la BD se inicializa ──────────────────────
  if (!dbReady) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando ejercicios…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <StepBar currentStep={step} totalSteps={TOTAL_STEPS} />

          {step === 0 && <StepPerfil data={data} set={set} />}
          {step === 1 && <StepRutina data={data} set={set} />}
          {step === 2 && <StepObjetivo data={data} set={set} />}
          {step === 3 && (
            <StepEquipment
              exercises={exercises}
              equipmentData={equipmentData}
              selectedEquipment={selectedEquipment}
              onToggle={toggleEquipment}
              onSelectAll={selectAllEquipment}
              onClearAll={clearAllEquipment}
            />
          )}
          {step === 4 && plan && (
            <StepPlan
              plan={plan}
              routine={routine}
              data={data}
              onReset={handleReset}
            />
          )}

          {step < 4 && (
            <View style={styles.nav}>
              {step > 0 && (
                <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
                  <Text style={styles.backLabel}>Atrás</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.nextBtn, !canNext() && styles.nextBtnDisabled]}
                onPress={handleNext}
                disabled={!canNext()}
                activeOpacity={0.8}
              >
                <Text style={[styles.nextLabel, !canNext() && styles.nextLabelDisabled]}>
                  {step === 3 ? "Ver mi plan" : "Siguiente →"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.background },
  flex:    { flex: 1 },
  scroll:  { flex: 1 },
  content: { padding: 16, paddingTop: 24 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  nav: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  backBtn: {
    flex: 1,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
  },
  backLabel: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  nextBtn: {
    flex: 2,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  nextBtnDisabled: {
    backgroundColor: colors.backgroundSecondary,
  },
  nextLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  nextLabelDisabled: {
    color: colors.textSecondary,
  },
});
